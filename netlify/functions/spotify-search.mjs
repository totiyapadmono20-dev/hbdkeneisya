// Netlify Function: Spotify track search (client credentials flow).
// Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in Netlify → Site settings → Environment variables.

let cachedToken = null;
let tokenExpiresAt = 0;

async function getToken(clientId, clientSecret) {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error(`token request failed: ${res.status}`);
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

export default async (req) => {
  const url = new URL(req.url);
  const q = (url.searchParams.get('q') || '').trim();
  if (q.length < 1 || q.length > 100) {
    return Response.json({ error: 'invalid query' }, { status: 400 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return Response.json({ error: 'spotify credentials not configured' }, { status: 500 });
  }

  try {
    const token = await getToken(clientId, clientSecret);
    const res = await fetch(
      `https://api.spotify.com/v1/search?type=track&limit=6&market=ID&q=${encodeURIComponent(q)}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) throw new Error(`search failed: ${res.status}`);
    const data = await res.json();
    const tracks = (data.tracks?.items || []).map((t) => ({
      id: t.id,
      title: t.name,
      artist: t.artists.map((a) => a.name).join(', '),
      image: t.album?.images?.[1]?.url || t.album?.images?.[0]?.url || null,
    }));
    return Response.json(tracks, {
      headers: { 'Cache-Control': 'public, max-age=30' },
    });
  } catch (err) {
    return Response.json({ error: String(err.message || err) }, { status: 502 });
  }
};

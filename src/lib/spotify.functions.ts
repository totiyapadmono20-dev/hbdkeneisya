import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

export type SpotifyResult = { id: string; title: string; artist: string; image: string | null };

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.token;
  const id = process.env['SPOTIFY_CLIENT_ID'];
  const secret = process.env['SPOTIFY_CLIENT_SECRET'];
  if (!id || !secret) throw new Error('Spotify credentials are not configured');
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${id}:${secret}`)}`,
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error(`Spotify auth failed: ${res.status}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

export const searchSpotify = createServerFn({ method: 'GET' })
  .inputValidator((data) => z.object({ query: z.string().min(1).max(100) }).parse(data))
  .handler(async ({ data }): Promise<SpotifyResult[]> => {
    const token = await getToken();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(data.query)}&type=track&limit=6&market=ID`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`Spotify search failed: ${res.status}`);
    const json = (await res.json()) as {
      tracks?: { items: Array<{ id: string; name: string; artists: Array<{ name: string }>; album: { images: Array<{ url: string }> } }> };
    };
    return (json.tracks?.items ?? []).map((t) => ({
      id: t.id,
      title: t.name,
      artist: t.artists.map((a) => a.name).join(', '),
      image: t.album.images[2]?.url ?? t.album.images[0]?.url ?? null,
    }));
  });

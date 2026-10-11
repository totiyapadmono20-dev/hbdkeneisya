// Lovable's asset path exists on Lovable hosting, not on self-hosted origins.
// Resolve saved media against the public app so it also works on Netlify.
const mediaOrigin = 'https://hbdkeneisya.lovable.app';

export function mediaUrl(url: string): string {
  return url.startsWith('/__l5e/assets-v1/') ? new URL(url, mediaOrigin).href : url;
}
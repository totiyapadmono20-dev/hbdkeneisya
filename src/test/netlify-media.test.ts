import { describe, expect, it } from 'vitest';
import { mediaUrl } from '@/lib/media';
import photo from '@/assets/pretty-girl.jpg.asset.json';
import video from '@/assets/cutest-girl.webm.asset.json';
import poster from '@/assets/cutest-girl-poster.jpg.asset.json';

describe('self-hosted gallery media', () => {
  it.each([photo, video, poster])('resolves saved media outside the Netlify origin', (asset) => {
    const resolved = new URL(mediaUrl(asset.url));
    expect(resolved.origin).toBe('https://hbdkeneisya.lovable.app');
    expect(resolved.pathname).toBe(asset.url);
  });
  it('preserves bundled images and visit-only uploads', () => {
    expect(mediaUrl('/assets/flowers.jpg')).toBe('/assets/flowers.jpg');
    expect(mediaUrl('blob:https://example.netlify.app/upload')).toBe('blob:https://example.netlify.app/upload');
  });
});
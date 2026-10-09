import { createFileRoute } from "@tanstack/react-router";
import { BirthdayOasis } from '@/components/BirthdayOasis';
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: 'Happy Birthday, Keneisya ♡ — Your Little Oasis' },
    { name: 'description', content: 'A birthday love letter for Keneisya, with a shared soundtrack, little memories, a pink guitar, and hugs across the distance.' },
    { property: 'og:title', content: 'Happy Birthday, Keneisya ♡' },
    { property: 'og:description', content: 'A little birthday oasis, made with a full heart. Music, memories, and an endless kind of love.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: BirthdayOasis,
});

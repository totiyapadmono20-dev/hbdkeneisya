// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    optimizeDeps: {
      // Optimize React's renderer with its hooks before the first page request.
      // Lazy discovery can otherwise leave an open tab using mixed dependency revisions.
      include: ['@tanstack/react-query', '@radix-ui/react-dialog', '@radix-ui/react-slot', 'lucide-react', 'canvas-confetti', '@supabase/supabase-js', '@tanstack/router-core', '@tanstack/router-core/isServer', '@tanstack/router-core/ssr/client', 'seroval'],
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});

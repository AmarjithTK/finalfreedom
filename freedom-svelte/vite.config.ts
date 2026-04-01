import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import fs from 'fs';

/**
 * Vite plugin: serves ../docs/*.md at /docs/* during dev,
 * and copies them into public/docs on build.
 */
function serveDocsPlugin() {
  const docsDir = resolve(__dirname, '../docs');

  return {
    name: 'serve-docs',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url?.startsWith('/docs/')) {
          const filename = decodeURIComponent(req.url.slice('/docs/'.length));
          const filePath = resolve(docsDir, filename);
          if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end(fs.readFileSync(filePath, 'utf-8'));
            return;
          }
        }
        next();
      });
    },
    writeBundle(options: any) {
      const outDir = options.dir || 'dist';
      const destDir = resolve(outDir, 'docs');
      if (!fs.existsSync(docsDir)) return;
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      const files = fs.readdirSync(docsDir).filter((f: string) => f.endsWith('.md'));
      for (const file of files) {
        fs.copyFileSync(resolve(docsDir, file), resolve(destDir, file));
      }
    },
  };
}

export default defineConfig({
  plugins: [svelte(), serveDocsPlugin()],
  server: {
    fs: { allow: ['..'] },
  },
});


import path from 'path';
import { spawnSync } from 'child_process';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Emits static HTML per route after the bundle is written.
 *
 * Runs as a separate `tsx` process rather than inside the Vite plugin hook:
 * the SSR entry needs React + the component tree compiled for Node, which is a
 * different target from the client bundle. It is still the same `seo/` source,
 * so prerendered output and runtime output cannot drift.
 */
function prerenderPlugin(): Plugin {
  return {
    name: 'devobi-prerender',
    apply: 'build',
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist');
      const result = spawnSync(
        process.execPath,
        [path.resolve(__dirname, 'node_modules/tsx/dist/cli.mjs'), 'scripts/prerender.ts', outDir],
        { stdio: 'inherit', cwd: __dirname },
      );
      if (result.status !== 0) {
        this.error(`prerender step failed with exit code ${result.status}`);
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 5173,
      host: '0.0.0.0',
      proxy: {
        '/api': 'http://localhost:3001'
      }
    },
    plugins: [
      react(),
      prerenderPlugin(),
      {
        name: 'survey-redirect',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/survey') {
              res.writeHead(301, { Location: 'https://forms.gle/vg4MozP4P4skYwSr6' });
              res.end();
              return;
            }
            next();
          });
        }
      }
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});

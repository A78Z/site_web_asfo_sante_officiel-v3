import fs from 'node:fs';
import path from "path";
import { pathToFileURL } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';

function imageProxyPlugin(): Plugin {
  return {
    name: 'image-proxy',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/proxy-image', async (req, res) => {
        const url = new URL(req.url!, 'http://localhost');
        const imageUrl = url.searchParams.get('url');
        if (!imageUrl) { res.writeHead(400); res.end('Missing url'); return; }
        try {
          const r = await fetch(imageUrl);
          const buf = Buffer.from(await r.arrayBuffer());
          res.writeHead(200, {
            'Content-Type': r.headers.get('content-type') || 'image/png',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(buf);
        } catch {
          res.writeHead(500); res.end('Proxy error');
        }
      });
    },
  };
}

/**
 * Exécute les fonctions serveur du dossier `api/` pendant `npm run dev`.
 *
 * En production, Vercel construit automatiquement chaque fichier de `api/` en
 * fonction serverless. Le serveur de développement Vite, lui, ne les connaît
 * pas : un POST sur `/api/cartes-membres/upload` retombait sur la reprise SPA
 * (réservée aux GET) et renvoyait un 404 vide, que l’interface traduisait par
 * « Le service de téléversement est introuvable ».
 */
function vercelApiPlugin(mode: string): Plugin {
  const apiDirectory = path.resolve(__dirname, 'api');

  return {
    name: 'vercel-api-dev',
    configureServer(server: ViteDevServer) {
      // Les fonctions lisent leur configuration dans `process.env` (dont la clé
      // master, jamais préfixée VITE_ pour rester hors du bundle client). Vite
      // n’expose que les variables VITE_ : on charge donc le reste ici, côté
      // serveur de développement uniquement.
      const environment = loadEnv(mode, process.cwd(), '');
      for (const [key, value] of Object.entries(environment)) {
        if (process.env[key] === undefined) process.env[key] = value;
      }

      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
        if (!pathname.startsWith('/api/')) {
          next();
          return;
        }

        // Comme Vercel, les chemins préfixés d’un tiret bas sont des modules
        // partagés (`api/_lib/…`), jamais des routes HTTP.
        const segments = pathname.slice(5).split('/');
        if (segments.some((segment) => segment.startsWith('_'))) {
          next();
          return;
        }

        // Résolution stricte à l’intérieur de `api/` : aucune remontée de chemin.
        const handlerFile = path.resolve(apiDirectory, `.${pathname.slice(4)}.js`);
        if (
          !handlerFile.startsWith(`${apiDirectory}${path.sep}`) ||
          !fs.existsSync(handlerFile)
        ) {
          next();
          return;
        }

        try {
          // Le runtime @vercel/node bufferise le corps dans `request.body` avant
          // d’appeler le handler ; les fonctions comptent dessus. Sans cette
          // étape, `submit.js` recevait un corps vide et le signalait à tort
          // comme « identifiant de la demande invalide ».
          await bufferRequestBody(request);

          // `mtimeMs` invalide le cache d’import : éditer une fonction suffit
          // à la recharger, sans redémarrer le serveur.
          const { mtimeMs } = fs.statSync(handlerFile);
          const module = await import(`${pathToFileURL(handlerFile).href}?v=${mtimeMs}`);
          await module.default(request, decorateResponse(response));
        } catch (error) {
          server.config.logger.error(
            `[vercel-api-dev] ${pathname} : ${(error as Error)?.message ?? 'erreur inconnue'}`,
          );
          if (!response.headersSent) {
            response.statusCode = 500;
            response.setHeader('Content-Type', 'application/json; charset=utf-8');
          }
          response.end(
            JSON.stringify({
              success: false,
              error: 'La fonction serveur a échoué en développement. Voir le terminal.',
              code: 'dev_handler_error',
            }),
          );
        }
      });
    },
  };
}

/** Corps maximal accepté en développement, aligné sur la limite de Vercel. */
const MAX_DEV_BODY_SIZE = 4.5 * 1024 * 1024;

/**
 * Reproduit la bufferisation du corps faite par @vercel/node : JSON analysé en
 * objet, tout autre type conservé en Buffer (ce qu’attend le lecteur multipart
 * de `upload.js`). Sans cela, `request.body` reste indéfini en développement.
 */
function bufferRequestBody(request: IncomingMessage) {
  return new Promise<void>((resolve, reject) => {
    const enriched = request as IncomingMessage & { body?: unknown };
    if (enriched.body !== undefined || request.method === 'GET' || request.method === 'HEAD') {
      resolve();
      return;
    }

    const chunks: Buffer[] = [];
    let size = 0;
    request.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_DEV_BODY_SIZE) {
        request.destroy();
        reject(new Error('Corps de requête trop volumineux.'));
        return;
      }
      chunks.push(chunk);
    });
    request.on('error', reject);
    request.on('end', () => {
      const raw = Buffer.concat(chunks);
      const contentType = (request.headers['content-type'] ?? '').toLowerCase();
      if (raw.length > 0 && contentType.includes('application/json')) {
        try {
          enriched.body = JSON.parse(raw.toString('utf8'));
        } catch {
          // Corps JSON illisible : la fonction décidera elle-même du refus.
          enriched.body = raw.toString('utf8');
        }
      } else {
        enriched.body = raw;
      }
      resolve();
    });
  });
}

/** Ajoute à la réponse Node les helpers `status()`/`json()` de @vercel/node. */
function decorateResponse(response: ServerResponse<IncomingMessage>) {
  const enriched = response as ServerResponse<IncomingMessage> & {
    status: (code: number) => typeof enriched;
    json: (payload: unknown) => void;
  };
  enriched.status = (code: number) => {
    enriched.statusCode = code;
    return enriched;
  };
  enriched.json = (payload: unknown) => {
    if (!enriched.headersSent) {
      enriched.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    enriched.end(JSON.stringify(payload));
  };
  return enriched;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), imageProxyPlugin(), vercelApiPlugin(mode)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));

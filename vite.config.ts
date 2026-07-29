import path from "path";
import { defineConfig, type Plugin, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
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

export default defineConfig({
  plugins: [react(), imageProxyPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

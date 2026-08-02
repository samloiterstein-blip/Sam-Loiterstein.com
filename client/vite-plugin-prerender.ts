import fs from "node:fs";
import path from "node:path";
import { createElement, type ComponentType } from "react";
import { renderToString } from "react-dom/server";
import type { Plugin, ResolvedConfig } from "vite";

/**
 * After the client build, SSR-render <App /> and inject the HTML into
 * dist/index.html so crawlers see real content without executing JS.
 */
export function prerenderSpa(): Plugin {
  let outDir = "";
  let root = "";

  return {
    name: "prerender-spa",
    apply: "build",
    configResolved(config: ResolvedConfig) {
      root = config.root;
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const { createServer } = await import("vite");
      const { default: react } = await import("@vitejs/plugin-react");

      const server = await createServer({
        root,
        configFile: false,
        plugins: [react()],
        resolve: {
          alias: {
            "@": path.resolve(root, "src"),
          },
        },
        server: { middlewareMode: true, hmr: false },
        appType: "custom",
        logLevel: "error",
        ssr: {
          // Keep React as a single Node instance (avoids CJS "module is not defined").
          external: ["react", "react-dom", "react-dom/server", "react/jsx-runtime"],
        },
      });

      try {
        const { default: App } = (await server.ssrLoadModule("/src/App.tsx")) as {
          default: ComponentType;
        };

        const appHtml = renderToString(createElement(App));
        const indexPath = path.join(outDir, "index.html");

        if (!fs.existsSync(indexPath)) {
          throw new Error(`[prerender] Missing ${indexPath}`);
        }

        const html = fs.readFileSync(indexPath, "utf8");
        const replaced = html.replace(
          /<div id="root"><\/div>/,
          `<div id="root">${appHtml}</div>`
        );

        if (replaced === html) {
          throw new Error("[prerender] Could not find empty #root in dist/index.html");
        }

        fs.writeFileSync(indexPath, replaced, "utf8");
        console.log(`[prerender] Injected ${appHtml.length.toLocaleString()} chars into index.html`);
      } finally {
        await server.close();
      }
    },
  };
}

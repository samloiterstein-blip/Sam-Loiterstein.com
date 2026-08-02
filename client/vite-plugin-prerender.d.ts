import type { Plugin } from "vite";
/**
 * After the client build, SSR-render <App /> and inject the HTML into
 * dist/index.html so crawlers see real content without executing JS.
 */
export declare function prerenderSpa(): Plugin;

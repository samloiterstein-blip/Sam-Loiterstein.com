var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
/**
 * After the client build, SSR-render <App /> and inject the HTML into
 * dist/index.html so crawlers see real content without executing JS.
 */
export function prerenderSpa() {
    var outDir = "";
    var root = "";
    return {
        name: "prerender-spa",
        apply: "build",
        configResolved: function (config) {
            root = config.root;
            outDir = path.resolve(config.root, config.build.outDir);
        },
        closeBundle: function () {
            return __awaiter(this, void 0, void 0, function () {
                var createServer, react, server, App, appHtml, indexPath, html, replaced;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, import("vite")];
                        case 1:
                            createServer = (_a.sent()).createServer;
                            return [4 /*yield*/, import("@vitejs/plugin-react")];
                        case 2:
                            react = (_a.sent()).default;
                            return [4 /*yield*/, createServer({
                                    root: root,
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
                                })];
                        case 3:
                            server = _a.sent();
                            _a.label = 4;
                        case 4:
                            _a.trys.push([4, , 6, 8]);
                            return [4 /*yield*/, server.ssrLoadModule("/src/App.tsx")];
                        case 5:
                            App = (_a.sent()).default;
                            appHtml = renderToString(createElement(App));
                            indexPath = path.join(outDir, "index.html");
                            if (!fs.existsSync(indexPath)) {
                                throw new Error("[prerender] Missing ".concat(indexPath));
                            }
                            html = fs.readFileSync(indexPath, "utf8");
                            replaced = html.replace(/<div id="root"><\/div>/, "<div id=\"root\">".concat(appHtml, "</div>"));
                            if (replaced === html) {
                                throw new Error("[prerender] Could not find empty #root in dist/index.html");
                            }
                            fs.writeFileSync(indexPath, replaced, "utf8");
                            console.log("[prerender] Injected ".concat(appHtml.length.toLocaleString(), " chars into index.html"));
                            return [3 /*break*/, 8];
                        case 6: return [4 /*yield*/, server.close()];
                        case 7:
                            _a.sent();
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        },
    };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { resolve } from "path";
import { defineConfig, loadEnv, ConfigEnv, UserConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig((env: ConfigEnv): UserConfig => {
  const config = loadEnv(env.mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      port: parseInt(config.VITE_PORT),
      proxy: {
        "/api": {
          target: config.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),

          bypass: (req, res, options: any) => {
            const proxyUrl = options.target + options.rewrite(req.url);
            res?.setHeader("proxy-Url", proxyUrl);
          },
        },
      },
    },
  };
});

// vite.config.ts
import fs from "node:fs";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
import { VitePWA } from "vite-plugin-pwa";

function normalizeBase(raw: string | undefined): string {
  const b = (raw ?? "/").trim() || "/";
  if (b === "/") return "/";
  return b.endsWith("/") ? b : `${b}/`;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = normalizeBase(env.VITE_BASE_PATH);
  const devApiProxy = env.VITE_DEV_API_PROXY || "http://localhost:8080";
  const rootDir = process.cwd();

  // 🔹 Путь к локальному mkcert.exe
  const mkcertPath = path.resolve(rootDir, "mkcert.exe");
  const hasMkcert = fs.existsSync(mkcertPath);

  const manualCertPath = path.resolve(rootDir, "cert.crt");
  const manualKeyPath = path.resolve(rootDir, "cert.key");
  const useManualHttpsCerts =
      mode === "development" &&
      fs.existsSync(manualCertPath) &&
      fs.existsSync(manualKeyPath);

  return {
    base,
    plugins: [
      react(),
      // 🔹 Включаем mkcert только в деве и если он есть
      mode === "development" && !useManualHttpsCerts && hasMkcert
          ? mkcert({
            source: "local",
            mkcertPath: mkcertPath, // 🔹 Указываем путь к скачанному файлу
          })
          : null,
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["pwa-192.png", "pwa-512.png", "vite.svg"],
        manifest: {
          name: "Расчёт экономии топлива - Круиз-контроль",
          short_name: "CruiseControl",
          description: "Приложение для расчёта экономии топлива",
          theme_color: "#DB2B36",
          background_color: "#ffffff",
          start_url: "/fuel-consumption-app/",
          scope: "/fuel-consumption-app/",
          display: "standalone",
          orientation: "portrait-primary",
          lang: "ru",
          icons: [
            { src: "pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
            { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,mp4,webm,wasm}"],
          maximumFileSizeToCacheInBytes: 35 * 1024 * 1024,
        },
        devOptions: {
          enabled: mode === "development",
        },
      }),
    ].filter(Boolean),
    server: {
      ...(useManualHttpsCerts
          ? {
            https: {
              cert: fs.readFileSync(manualCertPath),
              key: fs.readFileSync(manualKeyPath),
            },
          }
          : {}),
      watch: {
        usePolling: true,
      },
      host: true,
      strictPort: true,
      port: 3000,
      proxy: {
        '/api': {
          target: devApiProxy,
          changeOrigin: true,
        },
        // 🔹 Прокси для картинок (если понадобится в будущем)
        '/services': {
          target: 'http://localhost:9000',
          changeOrigin: true,
          secure: false,
        },
        '/object-media': {
          target: 'http://localhost:9000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/object-media/, ''),
        },
      },
    },
  };
});
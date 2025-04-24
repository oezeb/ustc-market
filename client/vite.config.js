import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": "/src",
        },
    },
    build: {
        outDir: "../server/src/main/resources/static",
        emptyOutDir: true,
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:8080/api",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
            "/uploads": {
                target: "http://localhost:8080/uploads",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/uploads/, ""),
            },
        },
    },
});

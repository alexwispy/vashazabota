import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	base: "/", // Корневой путь для Nginx
	server: {
		port: 3000, // Фронтенд запускается на 3000 (или измени на 3001)
		host: "0.0.0.0", // Доступ извне
		strictPort: true,
		allowedHosts: ["vashazabota.ru"], // Домен, с которого разрешён доступ
		proxy: {
			"/api": {
				target: "http://localhost:3001", // Проксируем API-запросы на 3001
				changeOrigin: true,
				secure: false,
			},
		},
	},
	build: {
		outDir: "build",
		emptyOutDir: true,
		rollupOptions: {
			output: {
				entryFileNames: "assets/[name].[hash].js",
				chunkFileNames: "assets/[name].[hash].js",
				assetFileNames: "assets/[name].[hash].[ext]",
			},
		},
	},
});

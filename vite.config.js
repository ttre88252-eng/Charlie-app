import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // listen on 0.0.0.0 so you can open it from Chrome on the same Android device (or LAN)
    port: 5173,
    strictPort: false,
    // Termux's storage/filesystem watcher can be flaky with the default watcher; polling is more reliable.
    watch: {
      usePolling: true,
      interval: 300
    }
  },
  preview: {
    host: true,
    port: 4173
  }
});

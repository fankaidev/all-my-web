import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { chromeExtension } from 'vite-plugin-chrome-extension';

export default defineConfig({
    plugins: [
        react(),
        chromeExtension({
            manifest: path.resolve(__dirname, 'src/manifest.json')
        })
    ],
    build: {
        rollupOptions: {
            input: {
                popup: 'src/popup/index.html',
                background: 'src/background.ts',
                content: 'src/content.ts'
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            }
        }
    }
});

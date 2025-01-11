import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import manifest from './manifest.json';

export default defineConfig({
    plugins: [
        react(),
        crx({ manifest })
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

import { crx, ManifestV3Export } from '@crxjs/vite-plugin';
import { resolve } from 'path';
import { defineConfig, mergeConfig } from 'vite';
import baseConfig, { baseBuildOptions, baseManifest } from './vite.config.base';

const outDir = resolve(__dirname, 'dist_chrome');

export default mergeConfig(
  baseConfig,
  defineConfig({
    base: './',
    plugins: [
      crx({
        manifest: {
          ...baseManifest,
          background: {
            service_worker: 'src/pages/background/index.ts',
            type: 'module'
          },
        } as ManifestV3Export,
        browser: 'chrome',
        contentScripts: {
          injectCss: true,
        }
      })
    ],
    build: {
      ...baseBuildOptions,
      outDir
    },
  })
)
import {defineConfig} from 'vite';
import path from 'path'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import {VantResolver} from 'unplugin-vue-components/resolvers';
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import viteCompression from 'vite-plugin-compression';
import autoprefixer from 'autoprefixer'
import eslint from 'vite-plugin-eslint'
import legacy from '@vitejs/plugin-legacy';
import {minify} from 'html-minifier-terser';
import createAuto from "./vite/auto";


/* 判断环境 */
// eslint-disable-next-line no-undef
const dev = process.env.NODE_ENV === 'development';

export default defineConfig({
    plugins: [
        vue(),
        eslint({
            cache: false,
            fix: true
        }),
        Components({
            resolvers: [
                VantResolver()
            ],
        }),
        legacy({
            targets: ['defaults', 'not IE 11'],
        }),
        {
            name: 'minify-html',
            transformIndexHtml(html) {
                return minify(html, {
                    collapseWhitespace: true,
                    removeComments: true,
                });
            },
        },
        viteCompression(),
        vueSetupExtend(),
        createAuto({
            image: 'src/assets',
            output: 'src/config/images.js',
            prefix: '@/',
            type: ['.jpg', '.svg', '.png']
        })
    ],
    esbuild: {
        drop: !dev ? ['console', 'debugger'] : []
    },
    build: {
        sourcemap: true,
        minify: false,
        cssTarget: "chrome61",
        outDir: "dist",
        rollupOptions: {
            output: {
                chunkFileNames: 'app/js/[hash].js',
                entryFileNames: 'app/js/[hash].js',
                assetFileNames: 'app/[ext]/[hash].[ext]',
            }
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `  
                     @import "@/theme/theme.scss";
                 `
            }
        },
        postcss: {
            plugins: [
                autoprefixer()
            ]
        }
    },
    server: {
        host: "0.0.0.0",
        port: 8081,
        hmr: {
            path: "/ws"
        },
        proxy: {
            '/api': {
                target: 'https://call.nicen.cn',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        }
    },
    resolve: {
        alias: {
            '@': path.join(__dirname, 'src')
        }
    }
})



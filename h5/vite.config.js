import {defineConfig} from 'vite';
import path from 'path'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import {VantResolver} from 'unplugin-vue-components/resolvers';
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import AutoImport from 'unplugin-auto-import/vite'
import rollup from './rollup'
import viteCompression from 'vite-plugin-compression';
import autoprefixer from 'autoprefixer'
import eslint from 'vite-plugin-eslint'

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
        viteCompression(),
        vueSetupExtend(),
        AutoImport(
            {
                imports: ['vue', 'pinia', 'vue-router'], //需要自动引入的包
                dts: './auto.js',//生成文件路径
                vueTemplate: true, //Auto import inside Vue template,
            }
        ),
    ],
    build: {
        sourcemap: true,
        minify: "terser",
        cssTarget: "chrome61",
        outDir: "dist",
        rollupOptions: rollup,
        terserOptions: {
            compress: {
                drop_console: true, //去掉所有console
                drop_debugger: true//去掉所有debugger
            }
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `  
                     @import "@/theme/theme.scss";
                     @import "@/theme/iconfont.scss"; 
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
        }
    },
    resolve: {
        alias: {
            '@': path.join(__dirname, 'src')
        }
    }
})



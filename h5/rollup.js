export default {
    output: {
        //解决打包时Some chunks are larger警告
        manualChunks(id) {
            if (id.includes('node_modules')) {
                return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
        },
        chunkFileNames: 'app/js/[hash].js',
        entryFileNames: 'app/js/[hash].js',
        assetFileNames: 'app/[ext]/[hash].[ext]',
    }
}
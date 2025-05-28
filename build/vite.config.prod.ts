/*
 * @Description:生产环境配置
 * @Autor: 王苏
 * @Date: 2021-05-27 14:43:30
 * @LastEditors: 王苏
 * @LastEditTime: 2021-05-27 14:46:30
 */
import { defineConfig } from 'vite'
import baseConfig from './vite.config.base'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
    ...baseConfig,
    define: {
        __DEV__: false,
    },
    build: {
        //输出目录
        outDir: 'dist',
        //关闭源码映射
        sourcemap: false,
        //混淆代码
        minify: 'terser',
        //去除生产环境控制台所有的打印日志
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            },
        },
        rollupOptions: {
            plugins: [
                viteCompression({
                    verbose: true,
                    disable: false,
                    threshold: 10240,
                    algorithm: 'gzip',
                    ext: '.gz'
                })
            ],
            output: {
                //将大文件分多个chunk打包
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0]
                    }
                },
                chunkFileNames: 'static/js1/[name]-[hash].js',
                entryFileNames: 'static/js2/[name]-[hash].js',
                assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
            },
        }
    }
})

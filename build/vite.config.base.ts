/*
 * @Description:基础配置
 * @Autor: 王苏
 * @Date: 2021-05-27 14:43:30
 * @LastEditors: 王苏
 * @LastEditTime: 2021-05-27 14:46:30
 */
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import vue from '@vitejs/plugin-vue'  // Vue 3 单文件组件支持插件
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'  // 图片压缩优化插件
import { visualizer } from 'rollup-plugin-visualizer'  // 打包体积分析插件，生成可视化报告
import { htmlCopyPlugin } from './plugins'  // 打包体积分析插件，生成可视化报告
export default {
    plugins: [
        vue(),  // 支持 .vue 文件解析
        ViteImageOptimizer({
            jpg: { quality: 90 },  // 对 jpg 图片压缩质量设置为 90
            png: { quality: 100 }  // 对 png 图片压缩质量设置为 100（无损压缩）
        }),
        htmlCopyPlugin(),
        visualizer({ open: true })  // 打包后自动打开体积分析报告页面
    ],

    resolve: {
        alias: {
            // 设置路径别名 '@' 指向项目的 src 目录，方便导入模块
            '@': fileURLToPath(new URL('../src', import.meta.url)),

        },
        // 允许导入这些扩展名的文件时可以省略后缀
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    css: {
        preprocessorOptions: {
            less: {
                // 每个 Less 文件自动引入全局变量文件 variables.less，无需手动 import
                additionalData: `@import "${path.resolve(__dirname, '../src/assets/less/base/variablesColor.less')}";`

            }
        }
    },
    // 如果项目部署在非根路径，可以取消注释并设置对应路径前缀，比如 '/collect/'
    // base: '/collect/',

}

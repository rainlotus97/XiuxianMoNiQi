/*
 * @Description:开发环境配置
 * @Autor: 王苏
 * @Date: 2021-05-27 14:43:30
 * @LastEditors: 王苏
 * @LastEditTime: 2021-05-27 14:46:30
 */

import { defineConfig } from 'vite'
import baseConfig from './vite.config.base'  // 导入基础配置

export default defineConfig({
  ...baseConfig,  // 继承基础配置中的所有配置项

  define: {
    __DEV__: true,  // 定义一个全局常量 __DEV__ 为 true，用于区分开发环境
  },

  server: {
    proxy: {
      // 这里配置代理，注释掉的部分是示例：
      // '/api': {
      //   target: 'http://192.168.0.100:23022',  // 代理目标服务器地址
      //   changeOrigin: true,  // 是否修改请求头中的 origin，避免跨域问题
      //   rewrite: path => path.replace(/^\/api/, '')  // 重写请求路径，去掉 /api 前缀
      // },
    },
  },

  build: {
    sourcemap: true  // 生成源码映射文件，方便调试
  }
})

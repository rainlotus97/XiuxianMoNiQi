/*
 * @Description:封装一个plugin用于解决生产环境造成的404问题
 * @Autor: 王苏
 * @Date: 2021-05-27 14:43:30
 * @LastEditors: 王苏
 * @LastEditTime: 2021-05-27 14:46:30
 */
import { Plugin } from 'vite'
import { execSync } from 'child_process'
import { copyFileSync, existsSync } from 'fs'
import { join } from 'path'

export  function htmlCopyPlugin(): Plugin {
  return {
    name: 'vite-plugin-html-copy',
    apply: 'build',
    async buildStart() {
      // 1. 类型检查
      try {
        execSync('vue-tsc -b', { stdio: 'inherit' })
      } catch (error) {
        console.error('[vite-plugin-html-copy] Type check failed.')
        throw error
      }
    },
    closeBundle() {
      // 2. 构建后复制 index.html 为 404.html
      const indexPath = join(process.cwd(), 'dist', 'index.html')
      const targetPath = join(process.cwd(), 'dist', '404.html')

      if (existsSync(indexPath)) {
        copyFileSync(indexPath, targetPath)
        console.log('[vite-plugin-html-copy] Copied index.html to 404.html')
      } else {
        console.warn('[vite-plugin-html-copy] index.html not found in dist/')
      }
    },
  }
}

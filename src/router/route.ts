// 动态导入所有 routes/*.ts 模块（默认导出一个 route 配置）
const modules = import.meta.glob('./routes/*.ts', { eager: true })

// 提取默认导出内容
const children = Object.values(modules).map((mod: any) => mod.default)

const routes = [
    {
        path: '/',
        children
    }
]


export default routes
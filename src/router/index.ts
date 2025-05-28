import { createRouter, createWebHistory } from 'vue-router'
import routes from './route'
import  setupRouterGuard  from './guard'

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 注册路由守卫
setupRouterGuard(router)
export default router;
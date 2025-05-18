import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        children: [
            {
                path: '/status',
                component: () => import('../pages/StatusView.vue'),
                meta: {
                    tab: 'status',
                    title: '状态'
                }
            },
            {
                path: '/backpack',
                component: () => import('../pages/BackPackView.vue'),
                meta: {
                    tab: 'backpack',
                    title: '背包'
                }
            },
            {
                path: '/cultivation',
                component: () => import('../pages/CultivationView.vue'),
                meta: {
                    tab: 'cultivation',
                    title: '修仙',
                    keepAlive: true
                }
            },
            {
                path: '/sect',
                component: () => import('../pages/SectView.vue'),
                meta: {
                    tab: 'sect',
                    title: '宗门'
                }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 在路由守卫中处理滚动行为
router.afterEach(() => {
    window.scrollTo(0, 0)
})
export default router;
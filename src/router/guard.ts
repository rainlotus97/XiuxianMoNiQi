import type {
    Router,
} from 'vue-router'

export default function setupRouterGuard(router: Router) {
    //路由前置守卫
    // router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    //     next()
    // });
    // 路由后置守卫
    router.afterEach(() => {
        // 页面跳转后滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' }) // 可选：平滑滚动
    })
}

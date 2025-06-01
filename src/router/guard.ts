import { PlayerDataManager } from '@/utils/playerdata/playerDataManager';
import type {
    NavigationGuardNext,
    RouteLocationNormalized,
    Router,
} from 'vue-router'

export default function setupRouterGuard(router: Router) {
    //路由前置守卫
    router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
        const isLoggedIn = PlayerDataManager.isLoginIn();
        
        // 只在根域名且已登录时，重定向到 /cultivation
        if (to.path === '/' && isLoggedIn) {
            return next({ path: '/cultivation' })
        }

        // 如果访问 /xxx 但未登录，可以强制回 Login
        if (to.path !== '/' && !isLoggedIn) {
            return next({ path: '/' })
        }
        next()
    });
    // 路由后置守卫
    router.afterEach(() => {
        // 页面跳转后滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' }) // 可选：平滑滚动
    })
}

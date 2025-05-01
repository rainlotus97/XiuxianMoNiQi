// useBattleLoop.ts
import { onMounted, onUnmounted } from 'vue'

export function useBattleLoop(callback: () => void, interval = 1000) {
    let animationId = 0
    let lastTime = 0

    const loop = (currentTime: number) => {
        if (currentTime - lastTime >= interval) {
            callback()
            lastTime = currentTime
        }
        animationId = requestAnimationFrame(loop)
    }

    onMounted(() => {
        lastTime = performance.now()
        animationId = requestAnimationFrame(loop)
    })

    onUnmounted(() => {
        cancelAnimationFrame(animationId)
    })
}

import { getCurrentInstance, type App, type Plugin } from 'vue';

/**
 * toast控制器
 */
class ToastController {
    private container: HTMLElement | null = null

    private initContainer() {
        if (!this.container) {
            this.container = document.createElement('div')
            this.container.className = 'toast-container'
            document.body.appendChild(this.container)
        }
    }

    private hide(toast: HTMLDivElement, onClose?: () => void) {
        toast.classList.remove('show')
        toast.classList.add('hide')
        toast.addEventListener(
            'transitionend',
            () => {
                toast.remove()
                onClose?.()
                if (toast.parentElement && toast.parentElement.children.length === 0) {
                    toast.parentElement.remove()
                }
            },
            { once: true }
        )
    }

    /**
     * 显示toast
     * 
     * @param message 信息
     * @param options 属性操作
     */
    public show(message: string, options?: { duration?: number; onClose?: () => void }) {
        this.initContainer()

        const duration = options?.duration ?? 2000
        const onClose = options?.onClose

        const toast = document.createElement('div')
        toast.className = 'toast'
        toast.textContent = message

        this.container!.appendChild(toast)

        // 触发动画
        requestAnimationFrame(() => {
            toast.classList.add('show')
        })

        // 自动隐藏
        const timer = window.setTimeout(() => {
            this.hide(toast, onClose)
        }, duration)

        toast.addEventListener('click', () => {
            clearTimeout(timer)
            this.hide(toast, onClose)
        })
    }
}

export const ToastPlugin: Plugin = {
    install(app: App) {
        const controller = new ToastController()
        app.config.globalProperties.$toast = controller
    }
}

export function useToast(): ToastController {
    const inst = getCurrentInstance()
    if (!inst) throw new Error('useToast must be called in setup()')
    return inst.appContext.config.globalProperties.$toast
}


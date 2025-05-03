export class BattleLoop {
    private animationId: number | null = null;
    private lastTime = 0;
    private readonly interval: number;
    private callback: (() => void) | null;
    private isRunning = false;
  
    /**
     * @param callback 每次间隔达到时执行的函数
     * @param interval 触发回调的最小时间间隔，单位 ms
     */
    constructor(callback: () => void, interval = 1000) {
      this.callback = callback;
      this.interval = interval;
    }
  
    /** 内部循环函数，绑定在实例上 */
    private loop = (currentTime: number) => {
      if (!this.isRunning) return;
  
      if (currentTime - this.lastTime >= this.interval) {
        this.callback?.();
        this.lastTime = currentTime;
      }
      this.animationId = requestAnimationFrame(this.loop);
    };
  
    /** 启动循环（若已在运行则无效） */
    public start(): void {
      if (this.isRunning) return;
      this.isRunning = true;
      this.lastTime = performance.now();
      this.animationId = requestAnimationFrame(this.loop);
    }
  
    /** 暂停循环（可通过 resume 恢复） */
    public pause(): void {
      if (!this.isRunning) return;
      this.isRunning = false;
      if (this.animationId !== null) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }
  
    /** 恢复循环（等价于 start，但不会重置 lastTime） */
    public resume(): void {
      if (this.isRunning) return;
      this.isRunning = true;
      this.animationId = requestAnimationFrame(this.loop);
    }
  
    /**
     * 完全停止并清理回调引用
     * 调用后实例不再可用，应废弃该对象以便 GC
     */
    public end(): void {
      this.pause();
      // 断开对外部回调的引用，避免闭包保留
      this.callback = null;
    }
  }
  
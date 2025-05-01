
// 定义断点配置（与 CSS 保持一致）
const BREAKPOINTS = {
    SMALL: 600,    // < 600px: 4 列
    MEDIUM: 1024   // 600-1024px: 8 列 | >1024px: 12 列
}
// 定义方向类型
export type OrientationType = 'portrait' | 'landscape';

// 媒体查询类型
interface mediaQueriesType {
    medium: MediaQueryList;
    large: MediaQueryList;
}

export interface MediaHelperType {
    orientationType: OrientationType;
    gridColumns: number;
}
// 防抖时间
const DEBOUNCE_TIME = 300

export type MediaHelperCallback = (info: MediaHelperType) => void;

// 媒体查询工具类
export class MediaCheckHelper {
    private static orientationType: OrientationType = MediaCheckHelper.getInitialOrientation();
    private static gridColumns: number = 4; // 默认列数
    private static mediaHelperCallback: MediaHelperCallback | null = null;
    // 防抖处理
    private static updatePending = false;

    private static mediaQueries: mediaQueriesType = {
        medium: window.matchMedia(`(min-width: ${BREAKPOINTS.SMALL}px)`),
        large: window.matchMedia(`(min-width: ${BREAKPOINTS.MEDIUM}px)`)
    }

    private static updateGrid = () => {
        MediaCheckHelper.gridColumns = MediaCheckHelper.mediaQueries.large.matches ? 12 :
            MediaCheckHelper.mediaQueries.medium.matches ? 8 : 4;
    }

    private static getInitialOrientation(): OrientationType {
        if (typeof window === 'undefined') return 'portrait';

        // 优先使用现代API
        if (screen.orientation) {
            return screen.orientation.type.startsWith('portrait')
                ? 'portrait'
                : 'landscape';
        }

        // 兼容旧版本浏览器
        return window.matchMedia('(orientation: portrait)').matches
            ? 'portrait'
            : 'landscape';
    }

    // 统一处理方向变化
    private static handleOrientationChange() {
        if (screen.orientation) {
            MediaCheckHelper.orientationType = screen.orientation.type.startsWith('portrait')
                ? 'portrait'
                : 'landscape';
        } else {
            MediaCheckHelper.orientationType = window.matchMedia('(orientation: portrait)').matches
                ? 'portrait'
                : 'landscape';
        }
    }

    private static updateScreenState() {
        if (MediaCheckHelper.updatePending) return;
        MediaCheckHelper.updatePending = true;
        setTimeout(() => {
            MediaCheckHelper.updatePending = false;
            // 更新列数
            MediaCheckHelper.updateGrid();
            // 更新方向
            MediaCheckHelper.handleOrientationChange();
            if (MediaCheckHelper.mediaHelperCallback) {
                MediaCheckHelper.mediaHelperCallback(MediaCheckHelper.getMediaHelperType());
            }
        }, DEBOUNCE_TIME);
    }

    // 初始化方法
    static init(callback: MediaHelperCallback): void {
        MediaCheckHelper.mediaHelperCallback = callback;
        // 初始化列数
        MediaCheckHelper.updateGrid();
        // 监听媒体查询变化
        window.addEventListener('resize', MediaCheckHelper.updateScreenState);
        // 监听方向变化事件
        if (screen.orientation) {
            screen.orientation.addEventListener('change', MediaCheckHelper.updateScreenState);
        } else {
            window.addEventListener('orientationchange', MediaCheckHelper.updateScreenState);
        }
    }

    // 销毁方法
    static destroy(): void {
        // 移除媒体查询监听
        window.removeEventListener('resize', MediaCheckHelper.updateScreenState);
        // 重置列数
        MediaCheckHelper.gridColumns = 4;
        MediaCheckHelper.mediaHelperCallback = null;
        // 移除方向变化事件监听
        if (screen.orientation) {
            screen.orientation.removeEventListener('change', MediaCheckHelper.updateScreenState);
        } else {
            window.removeEventListener('orientationchange', MediaCheckHelper.updateScreenState);
        }
    }

    static getMediaHelperType(): MediaHelperType {
        return {
            orientationType: MediaCheckHelper.orientationType,
            gridColumns: MediaCheckHelper.gridColumns
        }
    }
}
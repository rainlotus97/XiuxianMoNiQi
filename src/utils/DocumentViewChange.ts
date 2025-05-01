import { VaribaleSize } from "../common/variableConstant";

export class DocumentViewChange {
    /**
     * 设置窗口基准字体大小
     * 
     * @param fontSize 字体大小
     */
    static setWindowFontSize(fontSize: number) {
        document.documentElement.style.fontSize = `${fontSize}px`;
    }

    /**
     * 设置避让尺寸
     * 
     * @param left 左避让尺寸
     * @param top 上避让尺寸
     * @param right 右避让尺寸
     * @param bottom 下避让尺寸
     */
    static setWindowAvoidArea(left: number, top: number, right: number, bottom: number) {
        const fontSize = parseFloat(getComputedStyle(document.documentElement)['fontSize']);
        document.documentElement.style.setProperty(VaribaleSize.SIZE_AVOID_TOP, `${top / fontSize}rem`);
        document.documentElement.style.setProperty(VaribaleSize.SIZE_AVOID_BOTTOM, `${bottom / fontSize}rem`);
        document.documentElement.style.setProperty(VaribaleSize.SIZE_AVOID_LEFT, `${left / fontSize}rem`);
        document.documentElement.style.setProperty(VaribaleSize.SIZE_AVOID_RIGHT, `${right / fontSize}rem`);
    }

    /**
     * 设置默认主题色
     * @param bgColor 背景色
     * @param textColor 字体颜色
     */
    static setWindowTheme(bgColor: string, textColor: string) {
        document.documentElement.style.setProperty(VaribaleSize.COLOR_TEXT, textColor);
        document.documentElement.style.setProperty(VaribaleSize.COLOR_BACKGROUND, bgColor);
    }
}
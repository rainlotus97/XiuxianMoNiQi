import { reactive, type Reactive } from "vue";
import type { Person, SlideType } from "../common/battle/person";
import type { UnitState } from "../common/battle/unit";

export interface LogOptions {
    actor?: Reactive<Person>;
    target?: Reactive<Person>;
    skillName?: string;
    demage?: number;
    effect?: UnitState;
}

// 包裹<span>并打上对应class
function span(text: string, type: SlideType | 'system' | 'primary' | 'danger') {
    return `<span class="log-${type}">&nbsp;${text}&nbsp;</span>`;
}

enum UniStateName {
    de_dizziness = '眩晕',
    de_poisoned = '中毒',
    strengthen = '强化'
}

function getBuff(effect: UnitState) {
    const isDeBuff = effect.startsWith('de_');
    return `<span class="log-${isDeBuff ? 'de_' : ''}buff">${UniStateName[effect]}</span>`;
}

const MAX_LOG_SIZE: number = 100;
export class LogUtil {
    static LOG_LIST: Reactive<string[]> = reactive<string[]>([]);

    private static limitLog(log: string) {
        LogUtil.LOG_LIST.push(log);
        if (LogUtil.LOG_LIST.length > MAX_LOG_SIZE) {
            LogUtil.LOG_LIST.splice(0, Math.round(MAX_LOG_SIZE / 2));
        }
    }

    /** 普通攻击 */
    static attack(o: LogOptions) {
        const str = `${span(o.actor!.NAME, o.actor!.SLIDE)} 使用了${span('普通攻击', 'system')}，` +
            `${span(o.target!.NAME, o.target!.SLIDE)} 受到了 ${span(`${o.demage}`, 'system')}点伤害。`;
        LogUtil.limitLog(str);
    }
    /** 技能攻击 */
    static skillAttack(o: LogOptions) {
        const str = `${span(o.actor!.NAME, o.actor!.SLIDE)} 使用了技能 ${span(o.skillName!, 'system')}，` +
            `对 ${span(o.target!.NAME, o.target!.SLIDE)} 造成了 ${span(`${o.demage}`, 'system')}点伤害。`;
        LogUtil.limitLog(str);
    }
    /** 治疗 */
    static heal(o: LogOptions) {
        const str = `${span(o.actor!.NAME, o.actor!.SLIDE)} 使用了 ${span(o.skillName!, 'system')}，` +
            `${span(o.target!.NAME, o.target!.SLIDE)} 恢复了 ${span(`${o.demage}`, 'system')}点生命。`;
        LogUtil.limitLog(str);
    }
    /** 击败 */
    static defeated(o: LogOptions) {
        const str = `${span(o.target!.NAME, o.target!.SLIDE)} 被击败了，${span(o.actor!.NAME, o.actor!.SLIDE)}赢得了${span('胜利', "primary")}!`;
        LogUtil.limitLog(str);
    }
    /** 闪避 */
    static attackMiss(o: LogOptions) {
        const str = `${span(o.actor!.NAME, o.actor!.SLIDE)} 发起了攻击，但被${span(o.target!.NAME, o.target!.SLIDE)}成功${span('闪避', 'system')}!`;
        LogUtil.limitLog(str);
    }
    /** Buff 施加成功 */
    static buffApplied(o: LogOptions) {
        const str = `${span(o.actor!.NAME, o.actor!.SLIDE)} 向 ${span(o.target!.NAME, o.target!.SLIDE)} ` +
            `施加了 ${getBuff(o.effect!)} 效果。`;
        LogUtil.limitLog(str);
    }
    /** Buff 施加失败 */
    static buffAppliedFail(o: LogOptions) {
        const str = `${span(o.actor!.NAME, o.actor!.SLIDE)} 准备向 ${span(o.target!.NAME, o.target!.SLIDE)} ` +
            `施加 ${getBuff(o.effect!)} 效果，${span('却并没有成功', 'system')}。`;
        LogUtil.limitLog(str);
    }
    /** Buff 更新 */
    static buffUpdate(o: LogOptions) {
        const str = `${span(o.target!.NAME, o.target!.SLIDE)} 产生了${span('新', 'primary')}的 ${getBuff(o.effect!)} 效果。`;
        LogUtil.limitLog(str);
    }
    /** Buff 叠加 */
    static buffStrenthen(o: LogOptions) {
        const str = `${span(o.target!.NAME, o.target!.SLIDE)} 的 ${getBuff(o.effect!)} 效果得到${span('叠加', 'danger')}。`;
        LogUtil.limitLog(str);
    }
    /** Buff 失效 */
    static buffExpired(o: LogOptions) {
        const str = `${span(o.target!.NAME, o.target!.SLIDE)} 的 ${getBuff(o.effect!)} 效果已结束。`;
        LogUtil.limitLog(str);
    }
    /** 系统提示 */
    static system(msg: string) {
        const str = `<span class="log-system">${msg}</span>`;
        LogUtil.limitLog(str);
    }
};

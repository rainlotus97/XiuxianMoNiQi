import { reactive, type Reactive } from "vue";
import type { Person, PersonType } from "../common/battle/person";
import type { UnitState } from "../common/battle/unit";

export interface LogOptions {
    actor?: Reactive<Person>;
    target?: Reactive<Person>;
    skillName?: string;
    demage?: number;
    effect?: UnitState;
}




// 包裹<span>并打上对应class
function span(text: string, type: PersonType | 'system' | 'primary' | 'danger') {
    return `<span class="log-${type}">${text}</span>`;
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

export class LogUtil {
    static LOG_LIST: Reactive<string[]> = reactive<string[]>([]);
    /** 普通攻击 */
    static attack(o: LogOptions) {
        const str = `${span(o.actor!.NAME, o.actor!.IDENTITY)} 使用了${span('普通攻击', 'system')}，` +
            `${span(o.target!.NAME, o.target!.IDENTITY)} 受到了 ${span(`${o.demage}点伤害`, 'system')}。`;
        LogUtil.LOG_LIST.push(str);
    }
    /** 技能攻击 */
    static skillAttack(o: LogOptions) {
        const str = `${span(o.actor!.NAME, o.actor!.IDENTITY)} 使用了技能 ${span(o.skillName!, 'system')}，` +
            `对 ${span(o.target!.NAME, o.target!.IDENTITY)} 造成了 ${span(`${o.demage}点伤害`, 'system')}。`;
        LogUtil.LOG_LIST.push(str);
    }
    /** 治疗 */
    static heal(o: LogOptions) {
        const str = `${span(o.actor!.NAME, o.actor!.IDENTITY)} 使用了 ${span(o.skillName!, 'system')}，` +
            `${span(o.target!.NAME, o.target!.IDENTITY)} 恢复了 ${span(`${o.demage}点生命`, 'system')}。`;
        LogUtil.LOG_LIST.push(str);
    }
    /** 击败 */
    static defeated(o: LogOptions) {
        const str = `${span(o.target!.NAME, o.target!.IDENTITY)} 被击败了！`;
        LogUtil.LOG_LIST.push(str);
    }
    /** Buff 施加成功 */
    static buffApplied(o: LogOptions) {
        const str = `${span(o.actor!.NAME, o.actor!.IDENTITY)} 向 ${span(o.target!.NAME, o.target!.IDENTITY)} ` +
            `施加了 ${getBuff(o.effect!)} 效果。`;
        LogUtil.LOG_LIST.push(str);
    }
    /** Buff 施加失败 */
    static buffAppliedFail(o: LogOptions) {
        const str = `${span(o.actor!.NAME, o.actor!.IDENTITY)} 准备向 ${span(o.target!.NAME, o.target!.IDENTITY)} ` +
            `施加 ${getBuff(o.effect!)} 效果，${span('却并没有成功', 'system')}。`;
        LogUtil.LOG_LIST.push(str);
    }
    /** Buff 更新 */
    static buffUpdate(o: LogOptions) {
        const str = `${span(o.target!.NAME, o.target!.IDENTITY)} 产生了${span('新', 'primary')}的 ${getBuff(o.effect!)} 效果。`;
        LogUtil.LOG_LIST.push(str);
    }
    /** Buff 叠加 */
    static buffStrenthen(o: LogOptions) {
        const str = `${span(o.target!.NAME, o.target!.IDENTITY)} 的 ${getBuff(o.effect!)} 效果得到${span('叠加', 'danger')}。`;
        LogUtil.LOG_LIST.push(str);
    }
    /** Buff 失效 */
    static buffExpired(o: LogOptions) {
        const str = `${span(o.target!.NAME, o.target!.IDENTITY)} 的 ${getBuff(o.effect!)} 效果已结束。`;
        LogUtil.LOG_LIST.push(str);
    }
    /** 系统提示 */
    static system(msg: string) {
        const str = `<span class="log-system">${msg}</span>`;
        LogUtil.LOG_LIST.push(str);
    }
};


// 单位
export class Unit {
    // 气血
    HP: number = 100;
    // 法力
    MP: number = 50;
    // 攻击力
    ATK: number = 20;
    // 法术力
    M_ATK: number = 15;
    // 防御力
    DEF: number = 10;
    // 魔防力
    M_DEF: number = 8;
    // 物理穿透
    PEN: string = '0%';
    // 法术穿透
    M_PEN: string = '0%';
    // 速度
    SPD: number = 15;
    // 暴击率
    CRIT_RATE: string = '5%';
    // 暴击伤害
    CRIT_DMG: string = '150%';
    // 闪避率
    DODGE: string = '3%';
    // 命中率
    HIT: string = '90%';
    // 抗性概率
    RESIST: Partial<Record<UnitState, string>> = {
        de_dizziness: '5%',
        de_poisoned: '5%',
    };
}

// 重置单位属性
export const resetPartialUnit = (): Partial<Unit> => {
    return {
        // 气血
        HP: 0,
        // 法力
        MP: 0,
        // 攻击力
        ATK: 0,
        // 法术力
        M_ATK: 0,
        // 防御力
        DEF: 0,
        // 魔防力
        M_DEF: 0,
        // 物理穿透
        PEN: '0%',
        // 法术穿透
        M_PEN: '0%',
        // 速度
        SPD: 0,
        // 暴击率
        CRIT_RATE: '0%',
        // 暴击伤害
        CRIT_DMG: '0%',
        // 闪避率
        DODGE: '0%',
        // 命中率
        HIT: '0%',
        // 抗性概率
        RESIST: {
            de_dizziness: '0%',
            de_poisoned: '0%',
        }
    }
}

// 攻击类型
export enum AttackType {
    // 基础攻击
    NORMAL_ATTACK,
    // 物理攻击
    PHYSICAL_ATTACK,
    // 法术攻击
    MAGIC_ATTACK
}

// 单位状态
export enum UnitState {
    // 眩晕
    DIZZINESS = 'de_dizziness',
    // 中毒
    POISONED = 'de_poisoned',
    // 强化
    STRENGTHEN = 'strengthen'
}

// 单位效果
export interface UnitEffect {
    // 开始生效回合
    startCount: number,
    // 持续回合
    roundCount: number,
    // 异常状态
    state: UnitState,
    // 是否叠加
    isOverlay: boolean,
    // 属性
    status: Partial<Unit>
}
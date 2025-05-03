
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
    RESIST: Record<UnitState, string> = {
        de_dizziness: '5%',
        de_poisoned: '0%'
    };
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
}

// 单位效果
export interface UnitEffect {
    // 生效开始时间
    startTime: number,
    // 持续时间
    duration: number,
    // 异常状态
    state: UnitState,
    // 属性
    status: Partial<Unit>
}
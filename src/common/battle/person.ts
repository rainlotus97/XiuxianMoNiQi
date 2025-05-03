import { clampMin } from "../../utils/commonUtils";
import { AttackType, Unit, UnitState, type UnitEffect } from "./unit";

// 人物类型
export enum PersonType {
    // 玩家
    PLAYER = 'player',
    // 怪物
    MONSTER = 'monster',
    // 宠物
    PET = 'pet'
}


/**
 * 人物类型
 */
export class Person extends Unit {
    // 名字
    NAME: string = '';
    // 年龄
    AGE: number = 1;
    // 性别
    SEX: SexType = SexType.SECRET;
    // 身份
    IDENTITY: PersonType;
    // 经验
    EXP: number = 0;
    // 当前生命
    CURRENT_HP: number = this.HP;
    // 当前法力
    CURRENT_MP: number = this.MP;
    // 等级
    LEVEL: number = 0;
    // 状态列表
    STATE_LIST: Set<UnitState> = new Set();
    // 增益/减益效果(临时)
    private EFFECT_MAP: Map<string, UnitEffect> = new Map;
    // 附加属性(装备附带)
    private ADDITION_PERPORTY: Map<string, Partial<Unit>> = new Map();

    constructor(name: string, identity: PersonType, age: number = 1, sex: SexType = SexType.SECRET, exp: number = 0) {
        super();
        this.NAME = name;
        this.AGE = age;
        this.IDENTITY = identity;
        this.SEX = sex;
        this.EXP = exp;
        this.initData();
    }

    private initData(): void {
        this.LEVEL = this.getLevel();
        this.HP = Math.floor(this.HP + this.LEVEL * 50);
        this.CURRENT_HP = this.HP;
        this.MP = Math.floor(this.MP + this.LEVEL * 10);
        this.CURRENT_MP = this.MP;
        // todo 根据职业去区分
        this.ATK = Math.floor(this.ATK + this.LEVEL * 3);
        this.M_ATK = Math.floor(this.M_ATK + this.LEVEL * 2);
        this.DEF = Math.floor(this.DEF + this.LEVEL * 3);
        this.M_DEF = Math.floor(this.M_DEF + this.LEVEL * 2);
        // todo 根据职业去区分速度
        this.SPD = Math.floor(this.SPD + this.LEVEL * 2);
        this.CRIT_RATE = Math.floor(Math.max(this.ATK, this.M_ATK) / 100) + parseFloat(this.CRIT_RATE) + '%';
        this.CRIT_DMG = Math.floor(Math.max(this.ATK, this.M_ATK) / 100 * 2.5) + parseFloat(this.CRIT_DMG) + '%';
    }

    /**
     * 应用指定类型效果
     * 
     * @param type 类型
     * @param effect 效果
     */
    public useAdditionEffect(type: string, effect: Partial<Unit>): void {
        if (this.ADDITION_PERPORTY.has(type)) {
            this.deleteAdditionEffect(type)
        }
        this.ADDITION_PERPORTY.set(type, effect);
        this.deployStatus(effect);
    }

    /**
     * 清除指定类型效果
     * 
     * @param type 类型
     */
    public deleteAdditionEffect(type: string): void {
        let effect = this.ADDITION_PERPORTY.get(type) || null;
        if (this.ADDITION_PERPORTY.has(type)) {
            this.ADDITION_PERPORTY.delete(type);
        }
        effect && this.removeStatus(effect);
    }

    /**
     * 清除所有附加效果
     */
    public clearAllAdditionEffect(): void {
        this.ADDITION_PERPORTY.forEach((_effect: Partial<Unit>, type: string) => {
            this.deleteAdditionEffect(type);
        })
    }

    // 获取等级
    public getLevel(): number {
        // 经验公式EXP(L) = 100 * L^1.5
        return Math.floor(Math.pow((this.EXP / 100), (2 / 3)));
    }

    // 是否暴击
    private isCritcal(): boolean {
        return Math.random() <= parseFloat(this.CRIT_RATE) / 100 ? true : false;
    }

    /**
     * 清除效果
     */
    public deleteEffect(state: UnitState, isForce: boolean = false): void {
        if (this.EFFECT_MAP.has(state)) {
            const targetEffect = this.EFFECT_MAP.get(state) as UnitEffect;
            let currentDate = new Date().getTime();
            let isClear = currentDate - targetEffect.startTime >= targetEffect.duration;
            if (isForce || isClear) {
                this.removeStatus(targetEffect.status);
                this.EFFECT_MAP.delete(state);
                this.STATE_LIST.delete(state);
                console.log(this.NAME, state + '效果已经清除');
            }
        }
    }

    /**
     * 应用效果
     * @param effect 增益/减益效果
     */
    public useEffect(effect: UnitEffect): void {
        // 清除旧的效果
        if (this.EFFECT_MAP.has(effect.state)) {
            const targetEffect = this.EFFECT_MAP.get(effect.state) || null;
            if (targetEffect) {
                // 需要强制清除负面状态，重新设置
                this.deleteEffect(targetEffect.state, true);
            }
        }
        this.EFFECT_MAP.set(effect.state, effect);
        this.STATE_LIST.add(effect.state);
        this.deployStatus(effect.status);
        console.log(this.NAME, !effect.state.startsWith('de_') ? '获得了增益效果' : '受到了debuff效果' + effect.state);
    }

    public updateEffect() {
        if (!this.EFFECT_MAP.size) {
            console.log('无需清理异常状态数据');
            return;
        }
        this.EFFECT_MAP.forEach((effect: UnitEffect) => {
            this.deleteEffect(effect.state);
        })
    }

    // 应用效果
    private deployStatus(status: Partial<Unit>): void {
        Object.entries(status).forEach(([key, value]) => {
            const prop = key as keyof Person;
            if (key in this) {
                if (typeof value === 'number') {
                    (this[prop] as number) = clampMin(Math.floor((this[prop] as number) + value));
                } else if (typeof value === 'string') {
                    const currentValue = parseFloat((this[prop] as string));
                    (this[prop] as string) = clampMin(Math.floor(currentValue + parseFloat(value))) + '%';
                } else {
                    let currentValue = this[prop] as Record<UnitState, string>;
                    currentValue[UnitState.DIZZINESS] = clampMin(Math.floor(parseFloat(currentValue[UnitState.DIZZINESS]) + parseFloat(value[UnitState.DIZZINESS]))) + '%';
                    currentValue[UnitState.POISONED] = clampMin(Math.floor(parseFloat(currentValue[UnitState.POISONED]) + parseFloat(value[UnitState.POISONED]))) + '%';
                }
            }
        })
    }

    // 去除效果
    private removeStatus(status: Partial<Unit>): void {
        Object.entries(status).forEach(([key, value]) => {
            const prop = key as keyof Person;
            if (key in this) {
                if (typeof value === 'number') {
                    (this[prop] as number) = clampMin(Math.floor((this[prop] as number) - value));
                } else if (typeof value === 'string') {
                    const currentValue = parseFloat((this[prop] as string));
                    (this[prop] as string) = clampMin(Math.floor(currentValue - parseFloat(value))) + '%';
                } else {
                    let currentValue = this[prop] as Record<UnitState, string>;
                    currentValue[UnitState.DIZZINESS] = clampMin(Math.floor(parseFloat(currentValue[UnitState.DIZZINESS]) - parseFloat(value[UnitState.DIZZINESS]))) + '%';
                    currentValue[UnitState.POISONED] = clampMin(Math.floor(parseFloat(currentValue[UnitState.POISONED]) - parseFloat(value[UnitState.POISONED]))) + '%';
                }
            }
        })
    }

    /**
     * 获取物理伤害
     * 
     * @param targetDefence 敌方最终的防御值
     * @param skillMultiplier 技能倍率
     * @returns 最终的物理伤害
     */
    public getPhysicalDemage(targetDefence: number, skillMultiplier: number = 1): number {
        // 技能倍率 × { Attack × [Attack / (Attack + (TargetDefense × (1–Pen)) )] } × (暴击 ? 暴击倍数 : 1)
        const validDenominator = (this.ATK + (targetDefence * (1 - (parseFloat(this.PEN) / 100))));
        if (!validDenominator) {
            return 0;
        }
        return clampMin(Math.round(skillMultiplier * (this.ATK * (this.ATK / validDenominator)) * (this.isCritcal() ? parseFloat(this.CRIT_DMG) / 100 : 1)));
    }

    /**
     * 获取法术伤害
     * 
     * @param targetDefence 目标最终防御值
     * @param skillMultiplier 技能倍率
     * @returns 最终的法术伤害
     */
    public getMagicDemage(targetDefence: number, skillMultiplier: number = 1): number {
        // 技能倍率 × { MagicAttack × [MagicAttack / (MagicAttack + (TargetDefense × (1–PenM)) )] } × (暴击 ? 暴击倍数 : 1)
        const validDenominator = (this.M_ATK + (targetDefence * (1 - (parseFloat(this.M_PEN) / 100))));
        if (!validDenominator) {
            return 0;
        }
        return clampMin(Math.round(skillMultiplier * (this.M_ATK * (this.M_ATK / (this.M_ATK + (targetDefence * (1 - (parseFloat(this.M_PEN) / 100)))))) * (this.isCritcal() ? parseFloat(this.CRIT_DMG) / 100 : 1)));
    }

    /**
     * 获取最终防御值
     * 
     * @param attackType 攻击类型
     * @returns 防御值
     */
    public getFinalDenfence(attackType: AttackType = AttackType.NORMAL_ATTACK): number {
        // todo 对应元素伤害，需要乘上倍率，待后续新增
        let finalDefence = 0;
        // 魔法伤害
        if (attackType === AttackType.MAGIC_ATTACK) {
            finalDefence = this.M_DEF;
        } else {
            // 物理伤害
            finalDefence = this.DEF
        }
        return clampMin(finalDefence);
    }

    /**
     * 是否命中敌人
     * 
     * @param targetDodge 目标闪避率
     * @returns 命中结果
     */
    public isHitEnemy(targetDodge: string): boolean {
        const finalHit = parseFloat(this.HIT) - parseFloat(targetDodge);
        return Math.random() < finalHit / 100 ? true : false;
    }

    /**
     * 是否命中效果
     * 
     * @param targetResist 目标抵抗值
     * @param unitState 异常状态类型
     * @param extraHit 额外命中率
     * @returns 命中效果结果
     */
    public isHitEffect(targetResist: Record<UnitState, string>, unitState: UnitState, extraHit: string = '0%'): boolean {
        const resist = targetResist[unitState];
        const finalHit = parseFloat(this.HIT) + parseFloat(extraHit) - parseFloat(resist);
        return Math.random() < finalHit / 100 ? true : false;
    }
}

// 性别类型
export enum SexType {
    // 秘密
    SECRET = 'secret',
    // 男性
    MALE = 'male',
    // 女性
    FEMALE = 'female',
}


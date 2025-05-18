import { clampMin } from "../../utils/commonUtils";
import { LogUtil } from "../../utils/logUtils";
import { AttackType, Unit, UnitState, type UnitEffect, resetPartialUnit } from "./unit";

// 人物类型
export enum SlideType {
    // 友方
    FRIENDLY = 'friendly',
    // 怪物
    ENEMY = 'enemy',
}

export const MAX_GAUGE_COUNT: number = 1000;

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
    SLIDE: SlideType;
    // 经验
    EXP: number = 0;
    // 当前生命
    CURRENT_HP: number = this.HP;
    // 当前法力
    CURRENT_MP: number = this.MP;
    // 等级
    LEVEL: number = 0;
    // 增益/减益效果(临时)
    private EFFECT_MAP: Map<string, UnitEffect> = new Map;
    // 附加属性(装备附带)
    private ADDITION_PERPORTY: Map<string, Partial<Unit>> = new Map();
    // buff属性
    private BUFF_EFFECT: Partial<Unit> = resetPartialUnit();
    // 附加属性
    private EXTRA_EFFECT: Partial<Unit> = resetPartialUnit();
    // 回合数
    private ROUND_COUNT: number = 0;

    constructor(name: string, identity: SlideType, age: number = 1, sex: SexType = SexType.SECRET, exp: number = 0) {
        super();
        this.NAME = name;
        this.AGE = age;
        this.SLIDE = identity;
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

    public getStringUnit(key: keyof Unit) {
        return clampMin(Math.round(parseFloat(this[key] as string) + parseFloat(this.BUFF_EFFECT[key] as string || '0%') + parseFloat(this.EXTRA_EFFECT[key] as string || '0%'))) + '%';
    }

    public getNumberUnit(key: keyof Unit) {
        return clampMin(Math.round((this[key] as number) + (this.BUFF_EFFECT[key] as number || 0) + (this.EXTRA_EFFECT[key] as number || 0)));
    }

    /**
     * 获取对应异常状态抵抗值
     * @param state 单位状态
     * @returns 数值
     */
    public getResist(state: UnitState) {
        return clampMin(Math.round(parseFloat(this.RESIST[state] as string) + parseFloat(this.BUFF_EFFECT.RESIST?.[state] as string || '0%') + parseFloat(this.EXTRA_EFFECT.RESIST?.[state] as string || '0%'))) + '%';
    }

    public getRoundCount(): number {
        return this.ROUND_COUNT;
    }
    /**
     * 是否可行动
     */
    public canAct(): boolean {
        return this.CURRENT_HP ? true : false;
    }

    public updateIncomeInfo(income: IncomeType) {
        this.EXP += income.EXP;
        // todo 其余物品的获取待定
        console.log(this.NAME+' exp: '+this.EXP);
        
        // 更新等级属性
        let currentLevel = this.getLevel();
        if (currentLevel !== this.LEVEL) {
            this.initData();
        }

        // 清除所有临时属性
        this.reset();
    }

    public reset() {
        this.CURRENT_HP = this.getNumberUnit('HP');
        this.CURRENT_MP = this.getNumberUnit('MP');
        this.EFFECT_MAP.clear();
        this.BUFF_EFFECT = resetPartialUnit();
        this.ROUND_COUNT = 0;
    }

    /**
     * 更新状态
     * 
     * @param roundCount 回合数
     */
    public updateStatus(): void {
        this.ROUND_COUNT++;
        if (!this.EFFECT_MAP.size) {
            return;
        }
        this.EFFECT_MAP.forEach((effect: UnitEffect) => {
            this.deleteBuffEffect(effect.state);
        })
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
        this.deployStatus(effect, this.EXTRA_EFFECT);
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
        effect && this.removeStatus(effect, this.EXTRA_EFFECT);
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
        const critRate = this.getStringUnit('CRIT_RATE');
        return Math.random() <= parseFloat(critRate) / 100 ? true : false;
    }

    /**
     * 清除效果
     */
    public deleteBuffEffect(state: UnitState, isForce: boolean = false): void {
        if (this.EFFECT_MAP.has(state)) {
            const targetEffect = this.EFFECT_MAP.get(state) as UnitEffect;
            let isClear = this.ROUND_COUNT - targetEffect.startCount >= targetEffect.roundCount;
            if (isForce || isClear) {
                this.removeStatus(targetEffect.status, this.BUFF_EFFECT);
                this.EFFECT_MAP.delete(state);
            }
        }
    }

    /**
     * 应用效果
     * @param effect 增益/减益效果
     */
    public useBuffEffect(effect: UnitEffect): boolean {
        // 清除旧的效果
        const targetEffect = this.EFFECT_MAP.get(effect.state) || null;
        const isNewBuff: boolean = targetEffect ? false : true;
        if (targetEffect && !effect.isOverlay) {
            // 需要强制清除负面状态，重新设置
            this.deleteBuffEffect(targetEffect.state, true);
            LogUtil.buffUpdate({ target: this, effect: effect.state });
        } else if (targetEffect && effect.isOverlay) {
            // 需要融合数据
            this.deployStatus(targetEffect.status, effect.status);
            this.removeStatus(targetEffect.status, this.BUFF_EFFECT);
            LogUtil.buffStrenthen({ target: this, effect: effect.state });
        }
        this.EFFECT_MAP.set(effect.state, effect);
        this.deployStatus(effect.status, this.BUFF_EFFECT);
        return isNewBuff;
    }

    // 应用效果
    private deployStatus(status: Partial<Unit>, targetStatus: Partial<Unit>): void {
        Object.entries(status).forEach(([key, value]) => {
            const prop = key as keyof Partial<Unit>;
            if (key in targetStatus) {
                if (typeof value === 'number') {
                    (targetStatus[prop] as number) = (Math.floor((targetStatus[prop] as number) + value));
                } else if (typeof value === 'string') {
                    const currentValue = parseFloat((targetStatus[prop] as string));
                    (targetStatus[prop] as string) = (Math.floor(currentValue + parseFloat(value))) + '%';
                } else {
                    let targetValue = targetStatus[prop] as Record<UnitState, string>;
                    let statusValue = value as Record<UnitState, string>;
                    targetValue[UnitState.DIZZINESS] = (Math.floor(parseFloat(targetValue[UnitState.DIZZINESS]) + parseFloat(statusValue[UnitState.DIZZINESS]))) + '%';
                    targetValue[UnitState.POISONED] = (Math.floor(parseFloat(targetValue[UnitState.POISONED]) + parseFloat(statusValue[UnitState.POISONED]))) + '%';
                }
            }
        })
    }

    // 去除效果
    private removeStatus(status: Partial<Unit>, targetStatus: Partial<Unit>): void {
        Object.entries(status).forEach(([key, value]) => {
            const prop = key as keyof Partial<Unit>;
            if (key in targetStatus) {
                if (typeof value === 'number') {
                    (targetStatus[prop] as number) = (Math.floor((targetStatus[prop] as number) - value));
                } else if (typeof value === 'string') {
                    const currentValue = parseFloat((targetStatus[prop] as string));
                    (targetStatus[prop] as string) = (Math.floor(currentValue - parseFloat(value))) + '%';
                } else {
                    let targetValue = targetStatus[prop] as Record<UnitState, string>;
                    let statusValue = value as Record<UnitState, string>;
                    targetValue[UnitState.DIZZINESS] = (Math.floor(parseFloat(targetValue[UnitState.DIZZINESS]) - parseFloat(statusValue[UnitState.DIZZINESS]))) + '%';
                    targetValue[UnitState.POISONED] = (Math.floor(parseFloat(targetValue[UnitState.POISONED]) - parseFloat(statusValue[UnitState.POISONED]))) + '%';
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
        const attack = this.getNumberUnit('ATK');
        const validDenominator = (attack + (targetDefence * (1 - (parseFloat(this.PEN) / 100))));
        if (!validDenominator) {
            return 0;
        }
        return clampMin(Math.round(skillMultiplier * (attack * (attack / validDenominator)) * (this.isCritcal() ? parseFloat(this.CRIT_DMG) / 100 : 1)));
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
        const magicAttack = this.getNumberUnit('M_ATK');
        const magicPen = this.getStringUnit('M_PEN');
        const critDmg = this.getStringUnit('CRIT_DMG');
        const validDenominator = (magicAttack + (targetDefence * (1 - (parseFloat(magicPen) / 100))));
        if (!validDenominator) {
            return 0;
        }
        return clampMin(Math.round(skillMultiplier * (magicAttack * (magicAttack / (magicAttack + (targetDefence * (1 - (parseFloat(magicPen) / 100)))))) * (this.isCritcal() ? parseFloat(critDmg) / 100 : 1)));
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
            finalDefence = this.getNumberUnit('M_DEF');
        } else {
            // 物理伤害
            finalDefence = this.getNumberUnit('DEF');
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
        const finalHit = parseFloat(this.getStringUnit('HIT')) - parseFloat(targetDodge);
        return Math.random() < finalHit / 100 ? true : false;
    }

    /**
     * 是否命中效果
     * 
     * @param resist 抵抗值
     * @param extraHit 额外命中率
     * @returns 命中效果结果
     */
    public isHitEffect(resist: string, extraHit: string = '0%'): boolean {
        const hitValue = parseFloat(this.getStringUnit('HIT')) + parseFloat(extraHit);
        const finalHit = hitValue - parseFloat(resist);
        return Math.random() < finalHit / hitValue ? true : false;
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

export const getExpByLevel = (level: number): number => {
    // 经验公式EXP(L) = 100 * L^1.5
    return Math.round(100 * level ^ 1.5);
}

export interface IncomeType {
    // 获取经验 (+10: 加10经验; -10: 减10经验。)
    EXP: number;
    // 材料
    MATERIAL?: GoodsType;
    // 武器
    ARMS?: ArmsType;
}

// 武器类型
export interface ArmsType {
    // 名称
    name: string;
    // 种类 如：大剑，袖箭，弓箭，长编，枪等等
    type: string;
    // 描述
    description: string;
    // 效果
    effect: Partial<Unit>;
}

// 物品类型
export interface GoodsType {
    // 名称
    name: string;
    // 种类 如：木头、羽毛、龙血、草药
    type: string;
    // 描述
    description: string;
    // 效果
    effect?: Partial<Unit>;
}
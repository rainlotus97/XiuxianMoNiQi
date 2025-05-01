
export class Person {
    // 名称
    name: string = '';
    // 攻击
    attack: number = 0;
    // max hp
    maxHp: number = 0;
    // 当前hp
    currentHp: number = 0;
    // max mp
    maxMp: number = 0;
    // current mp
    currentMp: number = 0;
    // current exp
    currentExp: number = 0;
    // max exp
    maxExp: number = 0;

    constructor(name: string) {
        this.name = name;
    }

    // 更新生命值
    updateHp(attackValue: number) {
        // 防御的话额外计算
        this.currentHp -= attackValue;
        this.currentHp = this.currentHp > 0 ? this.currentHp : 0;
    }

    // 更新经验
    updateExp(exp: number) {
        this.currentExp += exp;
        this.currentExp = Math.min(this.maxExp, this.currentExp);
    }
}
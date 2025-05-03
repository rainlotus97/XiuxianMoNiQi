<template>
    <div class="game_container">
        <PersonView :name="xiuxianzhe.NAME" :identity="xiuxianzhe.IDENTITY" :current-h-p="xiuxianzhe.CURRENT_HP"
            :-max-h-p="xiuxianzhe.HP" :current-m-p="xiuxianzhe.CURRENT_MP" :-max-m-p="xiuxianzhe.MP" />
        <PersonView :name="guaiwu.NAME" :identity="guaiwu.IDENTITY" :current-h-p="guaiwu.CURRENT_HP" :-max-h-p="guaiwu.HP"
            :current-m-p="guaiwu.CURRENT_MP" :-max-m-p="guaiwu.MP" :is-l-t-r="true" />
    </div>
    <div class="box" style="display: flex;justify-content: space-evenly;">
        <button class="cancel" @click="cancelLoop">暂停战斗</button>
        <button class="start" @click="reStartLoop">恢复战斗</button>
    </div>
</template>
    
<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { Person, PersonType } from "../../common/battle/person";
import { reactive } from "vue";
import { BattleLoop } from "../../utils/battleLoop";
import { UnitState, type UnitEffect } from "../../common/battle/unit";
import PersonView from './Person.vue'
let person = new Person('陈平安', PersonType.PLAYER);
let monster = new Person('荒天帝', PersonType.MONSTER);

let xiuxianzhe = reactive<Person>(person);
let guaiwu = reactive<Person>(monster);

// 重置数据
const reset = () => {
    xiuxianzhe.CURRENT_HP = xiuxianzhe.HP;
    xiuxianzhe.CURRENT_MP = xiuxianzhe.MP;

    guaiwu.ATK = 15 + Math.random() * 10;
    guaiwu.CURRENT_HP = guaiwu.HP;
    guaiwu.CURRENT_MP = guaiwu.MP;
}

const attackFunc = () => {
    if (!xiuxianzhe.CURRENT_HP || !guaiwu.CURRENT_HP) {
        if (!guaiwu.CURRENT_HP) {
            xiuxianzhe.EXP += 10;
            console.log('修仙者获得了胜利,并获得经验10点,当前经验值为:', xiuxianzhe.EXP);
        } else {
            xiuxianzhe.EXP -= 10;
            console.log('怪物获得了胜利,并损失经验10点,当前经验值为:', xiuxianzhe.EXP);
        }
        reset()
        return;
    }
    if (xiuxianzhe.CURRENT_HP > 0) {
        if (!xiuxianzhe.isHitEnemy(guaiwu.DODGE)) {
            console.log('敌人进行了闪避');
            return;
        }
        if (xiuxianzhe.isHitEffect(guaiwu.RESIST, UnitState.DIZZINESS)) {
            const debuff: UnitEffect = {
                startTime: new Date().getTime(),
                duration: 2000,
                state: UnitState.DIZZINESS,
                status: {
                    ATK: -2,
                    DEF: -2
                }
            }
            guaiwu.useEffect(debuff);
        }
        const demage = xiuxianzhe.getPhysicalDemage(guaiwu?.getFinalDenfence() || 0);
        console.log(`修仙者发起了攻击,造成了${demage}点伤害`);
        guaiwu.CURRENT_HP = guaiwu.CURRENT_HP - demage > 0 ? Math.floor(guaiwu.CURRENT_HP - demage) : 0;
    }
    if (guaiwu.CURRENT_HP > 0) {
        if (!guaiwu.isHitEnemy(xiuxianzhe.DODGE)) {
            console.log('修仙者进行了闪避');
            return;
        }
        if (guaiwu.isHitEffect(xiuxianzhe.RESIST, UnitState.POISONED)) {
            const debuff: UnitEffect = {
                startTime: new Date().getTime(),
                duration: 2000,
                state: UnitState.POISONED,
                status: {
                    ATK: -2
                }
            }
            xiuxianzhe.useEffect(debuff);
        }
        const demage = guaiwu.getPhysicalDemage(xiuxianzhe?.getFinalDenfence() || 0);
        console.log(`怪物发起了攻击,造成了${demage}点伤害`);
        xiuxianzhe.CURRENT_HP = xiuxianzhe.CURRENT_HP - demage > 0 ? Math.floor(xiuxianzhe.CURRENT_HP - demage) : 0;
    }
    xiuxianzhe.updateEffect();
    guaiwu.updateEffect();
}
let battleLoop = new BattleLoop(attackFunc, 1000);

onMounted(() => {
    battleLoop.start();
    reset();

})
onUnmounted(() => {
    battleLoop.end();
})
const cancelLoop = () => {
    battleLoop.pause();
}
const reStartLoop = () => {
    battleLoop.resume();
}
</script>
    
<style lang="less">
.game_container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.green {
    width: 100px;
    height: 40px;
    background-color: green;
}

.red {
    width: 100px;
    height: 40px;
    background-color: red;
}
.box{
    margin-top: 20px;
}
</style>
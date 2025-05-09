<template>
    <span>{{ '已获得经验：' + playerList[0]?.EXP }}</span>
    <span>{{ ' 当前等级：' + playerList[0]?.LEVEL }}</span>
    <div class="combat_view" :class="{ flex_row: basicStore.mediaHelperType.gridColumns > 4 }">
        <div class="game_container">
            <div class="attack_list">
                <div class="attack_item" v-for="item in playerList" :key="item.NAME">
                    <PersonView :class="['unit-wrapper', animState[item.NAME]]" :name="item.NAME" :identity="item.IDENTITY"
                        :current-h-p="item.CURRENT_HP" :max-h-p="item.getNumberUnit('HP')" :current-m-p="item.CURRENT_MP"
                        :max-m-p="item.getNumberUnit('MP')" />
                </div>
            </div>
            <div class="attack_list">
                <div class="attack_item" v-for="item in enemyList" :key="item.NAME">
                    <PersonView :class="['unit-wrapper', animState[item.NAME]]" :name="item.NAME" :identity="item.IDENTITY"
                        :current-h-p="item.CURRENT_HP" :max-h-p="item.getNumberUnit('HP')" :current-m-p="item.CURRENT_MP"
                        :max-m-p="item.getNumberUnit('MP')" :is-l-t-r="true" />
                </div>
            </div>
        </div>
        <div class="box" v-if="basicStore.mediaHelperType.gridColumns === 4"
            style="display: flex;justify-content: space-evenly;">
            <button class="cancel btn" @click="cancelLoop">暂停战斗</button>
            <button class="start btn" @click="reStartLoop">恢复战斗</button>
        </div>
        <LogView />
    </div>
</template>
    
<script setup lang="ts">
import { onMounted, onUnmounted, type Reactive } from "vue";
import { Person, PersonType, type IncomeType } from "../../common/battle/person";
import { reactive } from "vue";
import { BattleLoop } from "../../utils/battleLoop";
import PersonView from './Person.vue';
import { EnemyGenrator } from "../../utils/enemyGenerator";
import { clampMin } from "../../utils/commonUtils";
import { UnitState, type UnitEffect } from "../../common/battle/unit";
import LogView from './LogView.vue';
import { LogUtil } from "../../utils/logUtils";
import { useBasicStore } from "../../stores/basicStore";
const basicStore = useBasicStore();
// generate playerList
let playerList: Reactive<Person[]> = reactive<Person[]>([]);

// generate enemyList
let enemyList: Reactive<Person[]> = reactive<Person[]>([]);
let personList: Reactive<Person[]> = [];

// 动画状态 map：unitId -> '' | 'attack' | 'hit' | 'counterattack' | 'hit-counter'
const animState = reactive<Record<string, string>>({});

// 重置数据
const reset = () => {
    personList.forEach((person: Reactive<Person>) => {
        person.reset();
    })
    queueList = personList.sort((a, b) => b.SPD - a.SPD);
}

const autoBattle = () => {
    const isPlayerFail: boolean = playerList.every((player: Reactive<Person>) => !player.CURRENT_HP);
    const isEnemyFail: boolean = enemyList.every((enemy: Reactive<Person>) => !enemy.CURRENT_HP);
    if (isPlayerFail) {
        playerList.forEach((player: Reactive<Person>) => {
            if (player.IDENTITY === PersonType.PLAYER) {
                const income: IncomeType = {
                    EXP: -10
                }
                player.updateIncomeInfo(income);
            }
        })
        reset();
        return;
    }
    if (isEnemyFail) {
        playerList.forEach((player: Reactive<Person>) => {
            if (player.IDENTITY === PersonType.PLAYER) {
                const income: IncomeType = {
                    EXP: Math.round(100 * Math.random())
                }
                player.updateIncomeInfo(income);
            }
        })
        reset();
        return;
    }
    // 寻找出手时机
    const person = getFirstPerson();
    if (!person) return;
    if (person.canAct()) {
        animState[person.NAME] = person.IDENTITY === PersonType.MONSTER ? 'attack' : 'counterattack';
        let targetList = person.IDENTITY === PersonType.MONSTER ? playerList : enemyList;
        const targetEnemy = targetList.filter((targetPerson: Reactive<Person>) => targetPerson.CURRENT_HP).sort((a, b) => a.CURRENT_HP - b.CURRENT_HP)[0]
        if (!person.isHitEnemy(targetEnemy.getStringUnit('DODGE'))) {
            console.log(`${person.NAME}发起了攻击，但被${targetEnemy.NAME}成功闪避!`);
            return;
        }
        const isDeBuff = Math.random() > 0.4 ? true : false;
        if (isDeBuff) {
            if (person.isHitEffect(targetEnemy.getResist(UnitState.POISONED))) {
                const debuff: UnitEffect = {
                    startCount: targetEnemy.getRoundCount(),
                    roundCount: 2,
                    state: UnitState.POISONED,
                    isOverlay: Math.random() >= 0.6 ? true : false, // 60%概率叠加毒素
                    status: {
                        DEF: -1,
                        ATK: -1
                    }
                }
                const isNewBuff = targetEnemy.useBuffEffect(debuff);
                if (isNewBuff) {
                    LogUtil.buffApplied({ actor: person, target: targetEnemy, effect: UnitState.POISONED })
                }
            } else {
                LogUtil.buffAppliedFail({ actor: person, target: targetEnemy, effect: UnitState.POISONED })
            }
        } else {
            const buff: UnitEffect = {
                startCount: person.getRoundCount(),
                roundCount: 2,
                state: UnitState.STRENGTHEN,
                isOverlay: true, // 60%概率叠加效果
                status: {
                    DEF: +10,
                    ATK: +10
                }
            }
            let frendList = person.IDENTITY === PersonType.MONSTER ? enemyList : playerList;
            const targetPerson = frendList[Math.round(Math.random() * (frendList.length - 1))]
            const isNewBuff = targetPerson.useBuffEffect(buff);
            if (isNewBuff) {
                LogUtil.buffApplied({ actor: person, target: targetPerson, effect: UnitState.STRENGTHEN })
            }
        }

        if (targetEnemy) {
            animState[targetEnemy.NAME] = person.IDENTITY === PersonType.MONSTER ? 'hit' : 'hit-counter';
            const demage = person.getPhysicalDemage(targetEnemy?.getFinalDenfence() || 0);
            targetEnemy.CURRENT_HP = clampMin(Math.round(targetEnemy.CURRENT_HP - demage));
            LogUtil.attack({ actor: person, target: targetEnemy, demage })
        }
        let timer = setTimeout(() => {
            delete animState[person.NAME];
            targetEnemy && delete animState[targetEnemy.NAME];
            clearTimeout(timer);
        }, targetEnemy ? 500 : 400); // 固定动画时间
        person.updateStatus();
    }
}

let queueList: Reactive<Person[]>;
const getFirstPerson = (): Reactive<Person> | undefined => {
    if (queueList.length) {
        let isLoop = true;
        while (isLoop) {
            let first = queueList.shift();
            if (first) {
                queueList.push(first);
                if (first.CURRENT_HP) {
                    isLoop = false;
                    return first;
                }
            }
        }
        return undefined;
    }
    return undefined;
}
let battleLoop: BattleLoop | null = null;
let person = new Person('陈平安', PersonType.PLAYER);
onMounted(() => {
    let person2 = new Person('宠物甲', PersonType.PET);
    let person3 = new Person('柳如烟', PersonType.PLAYER);
    person.SPD += 5;
    person2.SPD += 1;
    person3.SPD += 3;
    playerList.push(person);
    playerList.push(person2);
    playerList.push(person3);

    let enemies = EnemyGenrator.generateEnemies(0, 'easy');
    enemyList = enemies;
    personList = [...playerList, ...enemies];
    queueList = personList.sort((a, b) => b.SPD - a.SPD);
    battleLoop = new BattleLoop(autoBattle, 550);
    battleLoop.start();
})

onUnmounted(() => {
    battleLoop?.end();
})
const cancelLoop = () => {
    battleLoop?.pause();
}
const reStartLoop = () => {
    battleLoop?.resume();
}
</script>
    
<style lang="less">
.flex_row {
    display: flex;
    flex-direction: row;
}

.combat_view {}

.game_container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .attack_list {
        flex: 1;

        .attack_item {
            width: 100%;
            padding: 10px;
        }
    }
}

.box {
    margin: 20px 0;
    background-color: var(--color-background);

    .btn {
        width: 86px;
        height: 38px;
        border-radius: 4px;
        padding: 0;
        margin: 0;
        outline: none;
        border: none;
    }

    .cancel {
        background-color: rgb(154, 175, 202);
    }

    .start {
        background-color: rgb(9, 135, 239);
    }
}
</style>
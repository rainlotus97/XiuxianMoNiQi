<template>
    <span>{{ '已获得经验：' + gainExp }}</span>
    <span>{{ ' 当前等级：' + (person?.LEVEL || 0) }}</span>
    <div class="combat_view" :class="{ flex_row: basicStore.mediaHelperType.gridColumns > 4 }">
        <div class="game_container">
            <div class="attack_list">
                <div class="attack_item" v-for="item in playerList" :key="item.NAME">
                    <PersonView :class="['unit-wrapper', animState[item.NAME]]" :name="item.NAME" :identity="item.SLIDE"
                        :current-h-p="item.CURRENT_HP" :max-h-p="item.getNumberUnit('HP')" :current-m-p="item.CURRENT_MP"
                        :max-m-p="item.getNumberUnit('MP')" />
                </div>
            </div>
            <div class="attack_list">
                <div class="attack_item" v-for="item in enemyList" :key="item.NAME">
                    <PersonView :class="['unit-wrapper', animState[item.NAME]]" :name="item.NAME" :identity="item.SLIDE"
                        :current-h-p="item.CURRENT_HP" :max-h-p="item.getNumberUnit('HP')" :current-m-p="item.CURRENT_MP"
                        :max-m-p="item.getNumberUnit('MP')" :is-l-t-r="true" />
                </div>
            </div>
        </div>
        <div class="box" v-if="basicStore.mediaHelperType.gridColumns === 4"
            style="display: flex;justify-content: space-evenly;">
            <div class="cancel btn" @click="cancelLoop">暂停战斗</div>
            <div class="start btn" @click="reStartLoop">恢复战斗</div>
        </div>
        <LogView />
    </div>
</template>
    
<script setup lang="ts">
import { onMounted, onUnmounted, ref, type Reactive } from "vue";
import { Person, SlideType } from "@/common/battle/person";
import { reactive } from "vue";
import { BattleLoop } from "@/utils/battleLoop";
import PersonView from './Person.vue';
import { EnemyGenrator } from "@/utils/enemyGenerator";
import { clampMin } from "@/utils/commonUtils";
import { UnitState, type UnitEffect } from "@/common/battle/unit";
import LogView from './LogView.vue';
import { LogUtil } from "@/utils/logUtils";
import { useBasicStore } from "@/stores/basicStore";
import { PlayerDataManager } from "@/utils/playerdata/playerDataManager";
import { useToast } from "@/utils/toast";
import router from "@/router";
import type { AwardInfo } from "@/common/common";
import type { Ref } from "vue";
const basicStore = useBasicStore();
// 用户角色
let person: Ref<Person | null> = ref(null);
// generate playerList
let playerList: Reactive<Person[]> = reactive<Person[]>([]);
// generate enemyList
let enemyList: Reactive<Person[]> = reactive<Person[]>([]);
// 所有人物队列（无序）
let personList: Reactive<Person[]> = [];
// 战斗队列（有序）
let queueList: Reactive<Person[]>;
// 获得的经验
let gainExp: Ref<number> = ref(0);
// 动画状态 map：unitId -> '' | 'attack' | 'hit' | 'counterattack' | 'hit-counter'
const animState = reactive<Record<string, string>>({});

// 异常返回登录页
const exceptBack = () => {
    toast.show('数据异常，重新登录!')
    basicStore.setBackToLogin(true);
    router.replace('/');
}

// 重置数据
const reset = () => {
    if (!person.value) {
        exceptBack()
        return
    }
    let enemies = EnemyGenrator.generateEnemies(person.value.getLevel(), 'veryEasy');
    enemyList = enemies;
    playerList.forEach((person: Reactive<Person>) => {
        person.reset();
    })
    personList = [...playerList, ...enemies];
    queueList = personList.sort((a, b) => b.SPD - a.SPD);
}

// 自动战斗
const autoBattle = () => {
    const isPlayerFail: boolean = playerList.every((player: Reactive<Person>) => !player.CURRENT_HP);
    const isEnemyFail: boolean = enemyList.every((enemy: Reactive<Person>) => !enemy.CURRENT_HP);
    // 敌方胜利
    if (isPlayerFail) {
        let awardInfo: AwardInfo = {
            exp: -Math.round(10 * Math.random())
        }
        PlayerDataManager.gainAwardInfo(awardInfo);
        gainExp.value = PlayerDataManager.getPlayerData()?.assetsInfo?.exp || 0;
        LogUtil.defeated({ actor: enemyList[0], target: playerList[0] })
        reset();
        return;
    }
    // 玩家胜利
    if (isEnemyFail) {
        let awardInfo: AwardInfo = {
            exp: Math.round(10 * Math.random()),
        }
        PlayerDataManager.gainAwardInfo(awardInfo);
        gainExp.value = PlayerDataManager.getPlayerData()?.assetsInfo?.exp || 0;
        LogUtil.defeated({ target: enemyList[0], actor: playerList[0] })
        reset();
        return;
    }
    // 寻找出手时机
    const person = getFirstPerson();
    if (!person) return;
    if (person.canAct()) {
        animState[person.NAME] = person.SLIDE === SlideType.FRIENDLY ? 'attack' : 'counterattack';
        let targetList = person.SLIDE === SlideType.ENEMY ? playerList : enemyList;
        const targetEnemy = targetList.filter((targetPerson: Reactive<Person>) => targetPerson.CURRENT_HP).sort((a, b) => a.CURRENT_HP - b.CURRENT_HP)[0]
        if (!person.isHitEnemy(targetEnemy.getStringUnit('DODGE'))) {
            animState[targetEnemy.NAME] = 'miss';
            LogUtil.attackMiss({ actor: person, target: targetEnemy })
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
            let frendList = person.SLIDE === SlideType.ENEMY ? enemyList : playerList;
            const targetPerson = frendList[Math.round(Math.random() * (frendList.length - 1))]
            const isNewBuff = targetPerson.useBuffEffect(buff);
            if (isNewBuff) {
                LogUtil.buffApplied({ actor: person, target: targetPerson, effect: UnitState.STRENGTHEN })
            }
        }

        if (targetEnemy) {
            animState[targetEnemy.NAME] = person.SLIDE === SlideType.FRIENDLY ? 'hit' : 'hit-counter';
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

// 获取第一个角色
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
const toast = useToast();
onMounted(() => {
    let playerData = PlayerDataManager.getPlayerData();
    if (!playerData) {
        exceptBack();
        return;
    }
    const userInfo = playerData.userInfo;
    person.value = Person.fromObject(userInfo);
    gainExp.value = PlayerDataManager.getPlayerData()?.assetsInfo?.exp || 0;
    playerList.push(person.value);

    let enemies = EnemyGenrator.generateEnemies(clampMin(Math.round(person.value.getLevel() - 2)), 'veryEasy');
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
            padding: 0.625rem;
        }
    }
}

.box {
    margin: 1.25rem 0;
    background-color: var(--color-background);

    .btn {
        width: 5.375rem;
        height: 2.375rem;
        border-radius: 0.25rem;
        padding: 0;
        margin: 0;
        outline: none;
        border: none;
        text-align: center;
        line-height: 2.375rem;
    }

    .cancel {
        background-color: rgb(154, 175, 202);
        color: #fff;
    }

    .start {
        background-color: rgb(9, 135, 239);
        color: #fff;
    }
}
</style>
<template>
    <div class="game_container">
        <div class="green">
            {{ xiuxianzhe.currentHp }}
        </div>
        <div class="red">
            {{ guaiwu.currentHp }}
        </div>
    </div>
</template>
    
<script setup lang="ts">
import { onMounted } from "vue";
import { Person } from "../../common/person";
import { reactive } from "vue";
import { useBattleLoop } from "../../utils/battleLoop";
let person = new Person('小白');
let monster = new Person('亚古兽');

let xiuxianzhe = reactive<Person>(person);
let guaiwu = reactive<Person>(monster);
onMounted(() => {
    reset()

})

const reset = () => {
    xiuxianzhe.attack = 3;
    xiuxianzhe.currentHp = 10;
    xiuxianzhe.maxHp = 10;
    xiuxianzhe.maxMp = 10;
    xiuxianzhe.currentMp = 10;
    xiuxianzhe.maxExp = 100;

    guaiwu.attack = 2;
    guaiwu.currentHp = 10;
    guaiwu.maxHp = 10;
    guaiwu.maxMp = 10;
    guaiwu.currentMp = 10;
    guaiwu.maxExp = 100;
}

const attackFunc = () => {
    if (!xiuxianzhe.currentHp || !guaiwu.currentHp) {
        console.log('战斗胜利');
        reset()
        return;
    }
    console.log('战斗开始');
    if (xiuxianzhe.currentHp > 0) {
        guaiwu?.updateHp(xiuxianzhe.attack);
    }
    if (guaiwu.currentHp > 0) {
        xiuxianzhe?.updateHp(guaiwu?.attack);
    }
}

useBattleLoop(attackFunc)
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
</style>
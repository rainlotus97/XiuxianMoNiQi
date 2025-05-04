<template>
    <div class="person_view">
        <div class="icon_area" :class="{ pos_left: isLTR, pos_right: !isLTR }" :style="{ backgroundColor: iconColor }">
            {{ displayName }}
        </div>
        <div class="p_area" :class="{ pos_left: !isLTR, pos_right: isLTR }">
            <div class="main_hp flex_start" :class="{ flex_end: !isLTR, flex_start: isLTR }">
                <div class="current_hp" :style="{ width: hpPercent + '%' }">
                </div>
                <div class="hp_text" :class="{ pos_right: !isLTR, pos_left: isLTR, pr20: !isLTR, pl20: isLTR }">
                    {{ `${currentHP} / ${maxHP}` }}</div>
            </div>
            <div class="main_mp flex_start">
                <div class="current_mp" :style="{ width: mpPercent + '%' }">
                </div>
                <div class="mp_text" :class="{ pos_right: !isLTR, pos_left: isLTR, pr20: !isLTR, pl20: isLTR }">
                    {{ `${currentMP} / ${maxMP}` }}</div>
            </div>
        </div>
    </div>
</template>
    
<script setup lang='ts'>
import { computed } from 'vue';
import { PersonType } from '../../common/battle/person';
import { monsterColors, playerColors } from '../../utils/commonUtils';

/* Props 定义 */
interface Props {
    identity: PersonType,
    name: string;
    currentHP: number;
    maxHP: number;
    currentMP: number;
    maxMP: number;
    isLTR?: boolean;
}
const props = defineProps<Props>();

const displayName = computed(() => props.name.length > 3 ? props.name.slice(0, 2) + '...' : props.name);
const iconColor = computed(() => props.identity === PersonType.PLAYER ? playerColors[Math.round((playerColors.length - 1) * Math.random())] : monsterColors[Math.round((monsterColors.length - 1) * Math.random())])
const hpPercent = computed(() => props.maxHP ? (props.currentHP / props.maxHP * 100) : 0);
const mpPercent = computed(() => props.maxMP ? (props.currentMP / props.maxMP * 100) : 0);

</script>
    
<style lang="less">
.person_view {
    width: 6.25rem;
    height: 2.5rem;
    position: relative;
    border-radius: 0.25rem;
    overflow: hidden;

    .icon_area {
        width: 2.5rem;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 10;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-white);
        font-size: 0.75rem;
        font-weight: bolder;
    }

    .pos_left {
        left: 0;
    }

    .pos_right {
        right: 0;
    }

    .p_area {
        width: 5rem;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 9;
        background-color: #7b7b7b;

        .flex_start {
            justify-content: start;
        }

        .flex_end {
            justify-content: end;
        }

        .pr20 {
            padding-right: 1.25rem;
        }

        .pl20 {
            padding-left: 1.25rem;
        }

        .main_hp {
            height: 50%;
            display: flex;

            .current_hp {
                height: 100%;
                background-color: rgb(255, 21, 0);
                transition: width 0.5s ease;
                border-radius: 0.125rem;
            }

            .hp_text {
                position: absolute;
                top: 0;
                width: 100%;
                height: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.75rem;
                color: var(--color-text-white);
            }
        }

        .main_mp {
            height: 50%;
            display: flex;

            .current_mp {
                height: 100%;
                background-color: rgb(0, 149, 255);
                transition: width 0.5s ease;
                border-radius: 0.125rem;
            }

            .mp_text {
                position: absolute;
                top: 50%;
                width: 100%;
                height: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.75rem;
                color: var(--color-text-white);
            }
        }
    }
}
</style>
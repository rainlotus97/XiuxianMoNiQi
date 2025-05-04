<template>
    <div class="log_view" ref="container">
        <div class="log_item" v-for="(log, index) in LOGLIST" :key="index" v-html="log">
        </div>
    </div>
</template>
    
<script setup lang='ts'>
import { nextTick, ref, watch } from 'vue';
import { LogUtil } from '../../utils/logUtils';

const LOGLIST = LogUtil.LOG_LIST;
// 容器引用，用于控制滚动条
const container = ref<HTMLElement | null>(null);
watch(
    () => LOGLIST.length,
    async () => {
        await nextTick();
        if (container.value) {
            container.value.scrollTop = container.value.scrollHeight;
        }
    }
);
</script>
    
<style lang="less">
.log_view {
    width: 100%;
    height: 250px;
    overflow: auto;

    .log-player {
        color: #2ecc71;
        font-size: 1.125rem;
        font-weight: bold;
        /* 绿 */
    }

    .log-monster {
        color: #f33c28;
        font-size: 1rem;
        font-weight: bold;
        /* 红 */
    }

    .log-pet {
        color: #3498db;
        font-size: 1rem;
        font-weight: bold;
        /* 蓝 */
    }

    .log-de_buff {
        color: #a406f9;
        font-weight: bolder;
    }


    .log-buff {
        color: #f7fe3c;
        font-size: 1rem;
        font-weight: bolder;
    }

    .log-system {
        color: #999;
        font-style: italic;
    }

    .log-primary {
        font-size: 1.125rem;
        color: #4980f6;
    }

    .log-danger {
        font-size: 1rem;
        color: #f90909;
    }
}
</style>
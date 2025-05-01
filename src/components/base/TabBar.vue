<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { TabBarItem } from '../../common/common';

const route = useRoute()
const router = useRouter()

// Tabbar 配置项
const tabs = ref<TabBarItem[]>([
    { name: 'status', title: '状态', path: '/status' },
    { name: 'backpack', title: '背包', path: '/backpack' },
    { name: 'cultivation', title: '修仙', path: '/cultivation' },
    { name: 'sect', title: '宗门', path: '/sect' }
])

// 是否显示 Tabbar
const showTab = computed(() => !route.meta.hideTab)

// 判断当前激活项
const isActive = (tab: TabBarItem) => {
    return route.meta.tab === tab.name
}

// 导航逻辑（处理动态路由）
const navigateTo = (tab: TabBarItem) => {
    // 如果已经在当前 Tab 下，不重复跳转
    if (isActive(tab)) return

    // 动态路由处理：跳转到默认路径
    const basePath = tab.path.includes(':')
        ? tab.path.split('/:')[0]
        : tab.path

    router.push(basePath)
}
</script>

<template>
    <nav v-if="showTab" class="tab-bar">
        <div v-for="tab in tabs" :key="tab.name" :class="['tab-item', { active: isActive(tab) }]" @click="navigateTo(tab)">
            <span>{{ tab.title }}</span>
        </div>
    </nav>
</template>
  
<style lang="less">
.tab-bar {
    position: fixed;
    bottom: calc(var(--size-avoid-bottom) - var(--tab-bar-height));
    width: calc(100% - var(--size-avoid-left) - var(--size-avoid-right));
    height: var(--tab-bar-height);
    display: grid;
    line-height: var(--tab-bar-height);
    text-align: center;
    font-weight: bold !important;
    grid-template-columns: repeat(4, 1fr);
}

.tab-item {
    cursor: pointer;

    &:hover {
        color: var(--color-green);
        transition: color 0.5s;
    }
}

.active {
    color: var(--color-red) !important;
}
</style>
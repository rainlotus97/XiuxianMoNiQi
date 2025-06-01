<!-- SaveDataPage.vue -->
<template>
    <BaseModal v-model:visible="show" :title="title">
        <template #default>
            <div class="save-page">
                <ul class="save-list">
                    <li v-for="(save, idx) in saves" :key="save.encryptData"
                        :class="['save-item', { selected: save.encryptData === selectedData }]" @click="select(idx)">
                        <img class="cover" :src="save.userImage" alt="封面" />
                        <div class="info">
                            <div class="row editable">
                                <span class="label">存档名：</span>
                                <span class="value">
                                    {{ save.saveName }}
                                </span>
                            </div>
                            <div class="row">
                                <span class="label">昵称：</span>
                                <span class="value">{{ save.nickName }}</span>
                            </div>
                            <div class="row">
                                <span class="label">上次登录：</span>
                                <span class="value">{{ formatTime(save.lastOnlineTime) }}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </template>
        <template #footer>
            <span style="margin-right: 1rem; cursor: pointer;" @click="close">关闭</span>
            <span @click="load" style="cursor: pointer;">加载存档</span>
        </template>
    </BaseModal>
</template>
  
<script setup lang="ts">
import type { SaveDataInfo } from '@/common/common';
import { PlayerDataManager } from '@/utils/playerdata/playerDataManager';
import BaseModal from '@/components/base/BaseModal.vue';
import { watch, ref } from 'vue';
import { useBasicStore } from '@/stores/basicStore';
import { useToast } from '@/utils/toast';

const basicStore = useBasicStore();
const toast = useToast()

const props = defineProps<{
    show: boolean;
    title: string;
}>()
const show = ref(props.show)

const saves = ref<SaveDataInfo[]>([])
const selectedData = ref('');
let currentSaveData: SaveDataInfo | null;

const initData = () => {
    saves.value = [];
    selectedData.value = '';
    currentSaveData = null;
    Object.entries(basicStore.saveDataMap).forEach((value: [string, SaveDataInfo]) => {
        saves.value?.push(value[1])
    })
    currentSaveData = basicStore.saveDataMap[basicStore.currentPlayerId] || null;
    selectedData.value = currentSaveData?.encryptData || '';
    console.log('initData success,saves length is: ', saves.value.length);
}

// 监听外部显影变更
watch(() => props.show, (newValue: boolean) => {
    show.value = newValue;
    // 每当外部重新拉起存档页都需要初始化
    if (newValue) {
        initData()
    }
})

// 当前显示隐藏时需要通知外层关闭
watch(() => show.value, (newValue: boolean) => {
    if (!newValue) {
        close()
    }
})

// 加载存档
const load = () => {
    if (!selectedData.value) return
    if (!currentSaveData) {
        toast.show('请选择存档!');
        return
    }
    // 数据相同，无需更新数据
    if (currentSaveData.encryptData === basicStore.getCurrentPlayer()?.encryptData) {
        close();
        return;
    }
    PlayerDataManager.loadData(currentSaveData)
    emit('update:selectedId', basicStore.currentPlayerId)
    close();
}

const emit = defineEmits<{
    // 通知选中的userId
    (e: 'update:selectedId', val: string): void
    // 通知外层展示情况
    (e: 'update:show', val: boolean): void
}>()

// 通知外层关闭
const close = () => {
    emit('update:show', false)
}

// 选中
function select(idx: number) {
    currentSaveData = saves.value[idx]
    selectedData.value = currentSaveData.encryptData
}

// 时间格式化
function formatTime(ts: number): string {
    const d = new Date(ts)
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}
      ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
</script>
  
<style scoped>
::-webkit-scrollbar {
    display: none;
}

.save-page {
    padding: 1rem;
    background: #fff;
    color: #333;
}

.save-list {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 25rem;
    overflow-x: hidden;
    overflow-y: auto;
}

.save-item {
    display: flex;
    padding: 0.75rem;
    border: 1px solid #eee;
    border-radius: 6px;
    margin-bottom: 0.75rem;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
}

.save-item.selected {
    border-color: #409eff;
    background: #f0f8ff;
}

.cover {
    width: 4rem;
    height: 4rem;
    border-radius: 0.25rem;
    object-fit: cover;
    margin-right: 1rem;
    box-shadow: 0 0.125rem 0.375rem rgba(0, 0, 0, 0.1);
}

.info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.row {
    display: flex;
    margin-bottom: 0.4rem;
}

.label {
    width: 5rem;
    font-weight: 500;
    color: #666;
}

.value {
    flex: 1;
    color: #333;
}

.editable .value {
    user-select: none;
}

.save-name-input {
    flex: 1;
    padding: 0.2rem 0.4rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.save-item:hover {
    background: #f0f8ff;
}
</style>
  
import { defineStore } from 'pinia';
import { MediaCheckHelper, type MediaHelperType } from '../utils/mediaHelper';
import type { SaveDataInfo } from '../common/common';

export const useBasicStore = defineStore('basic', {
    state: () => ({
        // 媒体查询类型
        mediaHelperType: MediaCheckHelper.getMediaHelperType() as MediaHelperType,
        currentPlayerId: '',
        saveDataMap: new Map<string, SaveDataInfo>()
    }),
    actions: {
        // 更新媒体查询类型
        updateMediaHelperType(mediaHelperType: MediaHelperType) {
            this.mediaHelperType = mediaHelperType;
        },
        setCurrentPlayerId(playerId: string): void {
            this.currentPlayerId = playerId;
        },
        getCurrentPlayer(): SaveDataInfo | null {
            return this.saveDataMap.get(this.currentPlayerId) || null;
        },
        /**
         * 删除存档
         * 
         * @param userId 用户唯一标识
         */
        deleteSaveData(userId: string) {
            this.saveDataMap.delete(userId);
        },
        /**
         * 新增存档
         * 
         * @param userId 用户唯一标识
         * @param playerSaveData 用户存档数据
         */
        addSaveData(userId: string, playerSaveData: SaveDataInfo) {
            this.saveDataMap.set(userId, playerSaveData);
        },
        /**
         * 删除全部存档
         */
        clearAllSaveData() {
            this.saveDataMap.clear();
        }

    },
    persist: {
        key: 'common',
        storage: localStorage,
    },
})
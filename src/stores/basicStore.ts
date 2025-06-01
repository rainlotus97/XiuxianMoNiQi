import { defineStore } from 'pinia';
import { MediaCheckHelper, type MediaHelperType } from '../utils/mediaHelper';
import type { SaveDataInfo } from '../common/common';

export const useBasicStore = defineStore('basic', {
    state: () => ({
        mediaHelperType: MediaCheckHelper.getMediaHelperType() as MediaHelperType,
        currentPlayerId: '' as string,
        saveDataMap: {} as Record<string, SaveDataInfo>,
        isBackToLogin: false,
    }),
    actions: {
        /**
         * 设置回到登录页值
         * 
         * @param isBackToLogin 是否强制回到登录页
         */
        setBackToLogin(isBackToLogin: boolean): void {
            this.isBackToLogin = isBackToLogin;
        },
        updateMediaHelperType(mediaHelperType: MediaHelperType) {
            this.mediaHelperType = mediaHelperType
        },

        setCurrentPlayerId(playerId: string) {
            this.currentPlayerId = playerId
        },

        getCurrentPlayer(): SaveDataInfo | null {
            // 用对象的方式取
            return this.saveDataMap[this.currentPlayerId] || null
        },

        deleteSaveData(userId: string) {
            delete this.saveDataMap[userId]
            // 如果删掉的是当前玩家，也清空 currentPlayerId
            if (this.currentPlayerId === userId) {
                this.currentPlayerId = ''
            }
        },

        addSaveData(userId: string, playerSaveData: SaveDataInfo) {
            this.saveDataMap[userId] = playerSaveData
        },

        clearAllSaveData() {
            this.saveDataMap = {}
            this.currentPlayerId = ''
        },
    },
    persist: {
        key: 'common',
        storage: localStorage,
    },
})

import { defineStore } from 'pinia';
import { MediaCheckHelper, type MediaHelperType } from '../utils/mediaCheckHelper';

export const useCommonStore = defineStore('common', {
    state: () => ({
        // 媒体查询类型
        mediaHelperType: MediaCheckHelper.getMediaHelperType() as MediaHelperType,
    }),
    actions: {
        // 更新媒体查询类型
        updateMediaHelperType(mediaHelperType: MediaHelperType) {
            this.mediaHelperType = mediaHelperType;
        },
    },
    persist: {
        key: 'common',
        storage: sessionStorage,
    },
})
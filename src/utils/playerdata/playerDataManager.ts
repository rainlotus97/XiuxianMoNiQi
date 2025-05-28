import type { Person } from "../../common/battle/person";
import type { AwardInfo, PlayerInfo } from "../../common/common";
import { useBasicStore } from "../../stores/basicStore";
import { decryptData } from "../cryptTools";

/**
 * 用户数据管理
 */
export class PlayerDataManager {
    /**
     * 解密后的用户数据
     */
    private static playerData: PlayerInfo | null = null;
    /**
     * 用户数据是否存在
     */
    private static _isUserExist: boolean = false;

    /**
     * 奖励信息
     */
    private static awardInfo: AwardInfo | null = null;

    /**
     * 初始化数据
     */
    public static initData(): void {
        PlayerDataManager._isUserExist = false;
        const playerData = PlayerDataManager.getPlayerData();
        if (playerData) {
            PlayerDataManager._isUserExist = true;
            PlayerDataManager.awardInfo = playerData.assetsInfo || null;
            PlayerDataManager.playerData = playerData || null;
        }
    }

    /**
     * 获得奖励
     * 
     * @param awardInfo 奖励信息
     */
    public gainAwardInfo(awardInfo: AwardInfo): void {
        if (!PlayerDataManager.awardInfo) {
            PlayerDataManager.awardInfo = awardInfo;
            PlayerDataManager.syncAwardInfo();
            return;
        }
        if (PlayerDataManager.awardInfo.exp) {
            PlayerDataManager.awardInfo.exp += awardInfo.exp || 0;
        }
        PlayerDataManager.syncAwardInfo();
    }

    private static syncAwardInfo(): void {
        if (!PlayerDataManager.playerData) {
            return;
        }
        PlayerDataManager.playerData.assetsInfo = PlayerDataManager.awardInfo;
    }

    /**
     * 更新用户数据面板
     * 
     * @param personData 用户核心数据
     */
    public static updatePersonData(personData: Person): void {
        if (!PlayerDataManager.playerData) {
            return;
        }
        PlayerDataManager.playerData.userInfo = personData;
    }

    /**
     * 是否存在用户数据
     */
    public static isUserExist(): boolean {
        PlayerDataManager._isUserExist = false;
        const playerData = PlayerDataManager.getPlayerData();
        if (playerData) {
            PlayerDataManager._isUserExist = true;
        }
        return PlayerDataManager._isUserExist;
    }

    public static getPlayerData(): PlayerInfo | null {
        // 优先返回已有缓存数据
        if (PlayerDataManager.playerData) {
            return PlayerDataManager.playerData;
        }
        const basicStore = useBasicStore();
        // 获取本地数据
        const personSaveData = basicStore.getCurrentPlayer();
        if (!personSaveData) {
            return null;
        }
        const decryptPlayerData = JSON.parse(decryptData(personSaveData.encryptData)) as PlayerInfo;
        return decryptPlayerData;
    }
}
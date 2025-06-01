import { Person, SlideType } from "@/common/battle/person";
import type { AwardInfo, PlayerInfo, ProfessionType, SaveDataInfo } from "@/common/common";
import { useBasicStore } from "@/stores/basicStore";
import { decryptData, encryptData, generateUUID } from "../cryptTools";

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
     * 是否登录态
     * 
     * @returns 结果布尔值
     */
    public static isLoginIn() {
        const basicStore = useBasicStore();
        return !basicStore.isBackToLogin && PlayerDataManager.isUserExist();
    }

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
     * 加载存档
     * 
     * @param saveDataInfo 存档数据
     */
    public static loadData(saveDataInfo: SaveDataInfo) {
        const playerInfo = JSON.parse(decryptData(saveDataInfo.encryptData)) as PlayerInfo
        // 更新临时变量
        PlayerDataManager._isUserExist = true;
        PlayerDataManager.awardInfo = playerInfo.assetsInfo || null;
        PlayerDataManager.playerData = playerInfo || null;
        // 更新store中的数据
        const basicStore = useBasicStore();
        basicStore.setCurrentPlayerId(playerInfo.userId);
        basicStore.addSaveData(playerInfo.userId, saveDataInfo);
    }

    /**
     * 获得奖励
     * 
     * @param awardInfo 奖励信息
     */
    public static gainAwardInfo(awardInfo: AwardInfo): void {
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
        PlayerDataManager.syncInfoToLocal();
    }

    // 将数据持久化
    private static syncInfoToLocal() {
        const basicStore = useBasicStore();
        const saveInfo = basicStore.getCurrentPlayer();
        const playerData = PlayerDataManager.getPlayerData();
        if (!saveInfo || !playerData) {
            return;
        }
        saveInfo.encryptData = encryptData(JSON.stringify(playerData))
        saveInfo.lastOnlineTime = new Date().getTime();
        basicStore.addSaveData(basicStore.currentPlayerId, saveInfo);
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

    /**
     * 获取当前的玩家数据
     * 
     * @returns 玩家数据
     */
    public static getPlayerData(): PlayerInfo | null {
        // 优先返回已有缓存数据
        if (PlayerDataManager.playerData) {
            return PlayerDataManager.playerData;
        }
        // 获取本地数据
        const basicStore = useBasicStore();
        const personSaveData = basicStore.getCurrentPlayer();
        if (!personSaveData) {
            return null;
        }
        const decryptPlayerData = JSON.parse(decryptData(personSaveData.encryptData)) as PlayerInfo;
        return decryptPlayerData;
    }

    /**
     * 构造玩家数据
     * 
     * @param username 用户名
     * @param proffesion 职业属性
     */
    public static generatePlayerInfo(username: string, proffesion: ProfessionType) {
        const userInfo = new Person(username, SlideType.FRIENDLY, 13, proffesion.gender, 0, proffesion);
        const currentTime = new Date().getTime();
        const userId = generateUUID()
        const playerInfo: PlayerInfo = {
            userInfo,
            assetsInfo: null,
            createTime: currentTime,
            lastOnlineTime: currentTime,
            userId
        }
        const basicStore = useBasicStore();
        basicStore.setCurrentPlayerId(userId);
        const saveData: SaveDataInfo = {
            saveName: `存档${Object.keys(basicStore.saveDataMap).length + 1}`,
            nickName: username,
            lastOnlineTime: currentTime,
            userImage: proffesion.image,
            encryptData: encryptData(JSON.stringify(playerInfo))
        }
        basicStore.addSaveData(userId, saveData);
        PlayerDataManager.initData();
    }
}
import type { Person, SexType } from "./battle/person"

export interface TabBarItem {
    name: string,
    title: string,
    path: string
}

/**
 * 玩家数据结构
 */
export interface PlayerInfo {
    /**
     * 用户信息
     */
    userInfo: Partial<Person>,
    /**
     * 资产信息
     */
    assetsInfo: any,
    /**
     * 创建时间
     */
    createTime: number,
    /**
     * 最后活跃时间
     */
    lastOnlineTime: number,
    /**
     * 用户Id
     */
    userId: string
}

/**
 * 存档数据
 */
export interface SaveDataInfo {
    /**
     * 存档名称
     */
    saveName: string,
    /**
     * 用户昵称
     */
    nickName: string,
    /**
     * 最后存储时间
     */
    lastOnlineTime: number,
    /**
     * 头像
     */
    userImage: string,
    /**
     * 加密数据
     */
    encryptData: string
}

/**
 * 奖励信息
 */
export interface AwardInfo {
    /**
     * 经验
     */
    exp?: number,
    /**
     * 材料
     */
    material?: any,
    /**
     * 装备
     */
    equipment?: any
}
/**
 * 展示类型
 */
export enum ShowType {
    /**
     * 登录页
     */
    LOGIN,
    /**
     * 注册页
     */
    REGISTER,
    /**
     * 主页
     */
    HOME
}

/**
 * 职业类型
 */
export interface ProfessionType {
    name: string;
    type: ProfessionKind;
    gender: SexType;
    image: string;
}

export enum ProfessionKind {
    // 无
    NONE,
    // 剑客
    SWORDSMAN,
    // 符师
    TALISMAN,
    // 毒师
    POISONMASTER,
    // 医仙
    MEDICALFAIRY,
    // 狂人
    BERSERKER,
}
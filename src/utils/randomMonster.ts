import { SexType } from "../common/battle/person";

// types.ts
export type Monster = {
    name: string;
    level: number;
    age: number;
    gender: SexType;
    type: 'beast' | 'undead' | 'demon' | 'unknown';
    attributes: {
        hp: number;
        attack: number;
        defense: number;
    };
    skills: string[];
    description: string;
};

type NameComponents = {
    prefixes: string[];
    cores: string[];
    suffixes: string[];
};

type GrowthRate = {
    hp: number;
    attack: number;
    defense: number;
};

type ElementMap = Record<string, string[]>;
type TypeSkills = Record<Monster['type'], string[]>;

// 配置项类型
interface MonsterConfig {
    ageBase: number,
    agePerLevel: number,
    ageRandomRange: number, // ±20%波动
    nameComponents: NameComponents;
    baseAttributes: Omit<Monster['attributes'], 'hp' | 'attack' | 'defense'> & {
        hp: number;
        attack: number;
        defense: number;
    };
    growthRate: GrowthRate;
    skillRules: {
        elementMap: ElementMap;
        typeSkills: TypeSkills;
    };
    tierThresholds: {
        intermediate: number;
        advanced: number;
    };
}

// monster-generator.ts
const CONFIG: MonsterConfig = {
    ageBase: 15,
    agePerLevel: 3.5,
    ageRandomRange: 0.2, // ±20%波动
    nameComponents: {
        prefixes: ["幽冥", "赤焰", "噬魂", "九幽", "玄冰", "血煞", "混沌", "天罡"],
        cores: ["魔蛛", "妖虎", "鬼藤", "骨龙", "尸鹫", "影狼", "血鸦", "毒蟾"],
        suffixes: ["幼体", "变异体", "首领", "残魂", "化身"]
    },
    baseAttributes: {
        hp: 100,
        attack: 20,
        defense: 10
    },
    growthRate: {
        hp: 8.5,
        attack: 3.2,
        defense: 1.8
    },
    skillRules: {
        elementMap: {
            fire: ["赤焰", "炎", "焚天"],
            ice: ["玄冰", "寒", "霜冻"],
            poison: ["噬魂", "毒", "腐化"]
        },
        typeSkills: {
            beast: ["狂暴撕咬", "兽王威压"],
            undead: ["死灵复苏", "腐毒侵蚀"],
            demon: ["心魔蛊惑", "九幽鬼火"],
            unknown: []
        }
    },
    tierThresholds: {
        intermediate: 30,
        advanced: 50
    }
};

export const generateCultivationMonster = (level: number): Monster => {
    // 类型安全的随机选择函数
    const getRandom = <T>(arr: T[]): T =>
        arr[Math.floor(Math.random() * arr.length)];

    // 生成带类型校验的名称
    const generateName = (): string => {
        const { prefixes, cores, suffixes } = CONFIG.nameComponents;
        const suffix = level > 60 ? getRandom(suffixes.slice(2)) :
            level > 30 ? suffixes[1] : suffixes[0];

        const prefix = getRandom(prefixes);
        const connector = prefix.length === 2 && Math.random() > 0.4 ? "·" : "";
        return `${prefix}${connector}${getRandom(cores)}${suffix}`;
    };

    // 属性计算（严格类型）
    const parseAttributes = (name: string): Monster['attributes'] => {
        const base = { ...CONFIG.baseAttributes };
        (Object.keys(CONFIG.growthRate) as (keyof GrowthRate)[]).forEach(k => {
            base[k] += Math.floor(level * CONFIG.growthRate[k]);
        });

        Object.entries(CONFIG.skillRules.elementMap).forEach(([elem, keywords]) => {
            if (keywords.some(k => name.includes(k))) {
                switch (elem) {
                    case 'fire': base.attack *= 1.2; break;
                    case 'ice': base.defense *= 1.3; break;
                    case 'poison': base.hp *= 1.15; break;
                }
            }
        });

        return base;
    };

    // 类型守卫检测
    const detectMonsterType = (name: string): Monster['type'] => {
        const typeRules: Record<Monster['type'], string[]> = {
            beast: ["虎", "狼", "蛛"],
            undead: ["尸", "骨", "鬼"],
            demon: ["魔", "煞", "幽冥"],
            unknown: []
        };

        return (Object.entries(typeRules) as [Monster['type'], string[]][])
            .find(([_, keys]) => keys.some(k => name.includes(k)))?.[0] || 'unknown';
    };

    // 生成技能（严格类型约束）
    const generateSkills = (name: string): string[] => {
        const skills: string[] = [];

        // 元素技能
        Object.entries(CONFIG.skillRules.elementMap).forEach(([elem, keywords]) => {
            if (keywords.some(k => name.includes(k))) {
                skills.push(`${elem.toUpperCase()}系精通`);
            }
        });

        // 类型技能
        const type = detectMonsterType(name);
        skills.push(...CONFIG.skillRules.typeSkills[type]);

        // 等级技能
        if (level >= CONFIG.tierThresholds.advanced) skills.push("元神出窍");
        return [...new Set(skills)];
    };

    const getAge = () => {
        const baseAge = CONFIG.ageBase + level * CONFIG.agePerLevel;
        const randomFactor = 1 + (Math.random() * 2 - 1) * CONFIG.ageRandomRange;
        return Math.floor(baseAge * randomFactor);
    };

    const getGender = () => {
        // 中性名称按概率随机
        return Math.random() > 0.6 ? SexType.MALE : SexType.FEMALE; // 默认60%男性
    };

    // 生成最终对象
    const name = generateName();
    return {
        name,
        level,
        age: getAge(),
        gender: getGender(),
        type: detectMonsterType(name),
        attributes: parseAttributes(name),
        skills: generateSkills(name),
        description: `散发着${name.includes('幽冥') ? '阴森鬼气' : '狂暴灵气'}的修真界生物`
    };
}
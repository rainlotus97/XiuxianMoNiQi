import { Person, PersonType, getExpByLevel } from "../common/battle/person";
import { generateCultivationMonster } from "./randomMonster";

// 难度
export type Difficulty = 'easy' | 'normal' | 'hard' | 'boss';

interface EnemyNumType {
    easy: number;
    normal: number;
    hard: number;
    boss: number;
}


export class EnemyGenrator {

    // 对应难度所生成的怪物数量
    private static countMap: EnemyNumType = { easy: 2, normal: 3, hard: 4, boss: 1 };
    // 对应难度放缩倍数
    private static scale: EnemyNumType = { easy: 0.8, normal: 1, hard: 1.2, boss: 2 };

    /**
     * 生成怪物数组
     * 
     * @param level 玩家等级
     * @param difficulty 难度
     */
    static generateEnemies(level: number, difficulty: Difficulty): Person[] {
        const num = EnemyGenrator.countMap[difficulty];
        const factor = EnemyGenrator.scale[difficulty];
        const enemies: Person[] = [];
        for (let i = 0; i < num; i++) {
            const randomMonster = generateCultivationMonster(level);
            const person = new Person(randomMonster.name, PersonType.MONSTER, randomMonster.age, randomMonster.gender, getExpByLevel(randomMonster.level));
            person.ATK = Math.round(person.ATK * factor);
            person.M_ATK = Math.round(person.M_ATK * factor);
            person.HP = Math.round(person.HP * factor);
            person.CURRENT_HP = Math.round(person.CURRENT_HP * factor);
            person.MP = Math.round(person.MP * factor);
            person.CURRENT_MP = Math.round(person.CURRENT_MP * factor);
            person.DEF = Math.round(person.DEF * factor);
            person.M_DEF = Math.round(person.M_DEF * factor);
            person.SPD = Math.round((person.SPD - i) * factor);
            person.CRIT_RATE = Math.round(parseFloat(person.CRIT_RATE) * factor) + '%';
            person.CRIT_RATE = Math.round(parseFloat(person.CRIT_RATE) * factor) + '%';
            // 简单选第一个技能
            // const skills: Skill[] = [ /* your default Skills */ ];
            enemies.push(person);
        }
        return enemies;
    }
}
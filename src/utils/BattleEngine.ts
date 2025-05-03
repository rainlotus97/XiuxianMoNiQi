// import type { Unit, StatusEffect } from '../common/Unit';
// import { basicAttack } from './Skill';

// export class BattleEngine {
//   public units: Unit[];
//   public logs: string[] = [];
//   private turn = 1;

//   constructor(units: Unit[]) {
//     this.units = units;
//   }

//   public start(): string[] {
//     this.logs = [];
//     while (!this.isBattleOver()) {
//       this.log(`---- 回合 ${this.turn} ----`);
//       const turnOrder = this.units.filter(u => u.alive).sort((a, b) => b.spd - a.spd);
//       for (const unit of turnOrder) {
//         if (!unit.alive || this.isStunned(unit)) continue;
//         const target = this.chooseTarget(unit);
//         if (!target) continue;
//         const skill = unit.skills?.[0] ?? basicAttack;
//         const result = skill.use(unit, [target]);
//         this.log(result);

//         if (this.isBattleOver()) break;
//       }
//       this.applyStatusEffects();
//       this.turn++;
//     }
//     this.log('战斗结束，胜者：' + this.getWinner());
//     return this.logs;
//   }

//   private chooseTarget(attacker: Unit): Unit | null {
//     const enemies = this.units.filter(u => u.side !== attacker.side && u.alive);
//     return enemies.sort((a, b) => a.hp - b.hp)[0] || null;
//   }

//   private isBattleOver(): boolean {
//     const playersAlive = this.units.some(u => u.side === 'player' && u.alive);
//     const enemiesAlive = this.units.some(u => u.side === 'enemy' && u.alive);
//     return !playersAlive || !enemiesAlive;
//   }

//   private getWinner(): string {
//     return this.units.some(u => u.side === 'player' && u.alive) ? '玩家' : '敌人';
//   }

//   private isStunned(unit: Unit): boolean {
//     return unit.status?.some(s => s.id === 'stunned') ?? false;
//   }

//   private applyStatusEffects() {
//     for (const unit of this.units) {
//       if (!unit.status) continue;
//       for (const status of [...unit.status]) {
//         status.duration--;
//         if (status.duration <= 0 && status.remove) {
//           status.remove(unit);
//         }
//       }
//       unit.status = unit.status?.filter(s => s.duration > 0);
//     }
//   }

//   private log(msg: string): void {
//     this.logs.push(msg);
//   }
// }

/**
 * 获取最大值
 * @param value 数值
 * @param min 最小值
 * @returns 返回最大值
 */
export const clampMin = (value: number, min: number = 0): number => {
    return Math.max(value, min);
}

export const playerColors = ['#2ad41a','#04aef8','#f780c6'];
// export const petColors = ['#02c911','#04aef8','#f780c6'];
export const monsterColors = ['#410a0a','#3f3f3d','#abbbb9'];
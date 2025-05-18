/**
 * 获取最大值
 * @param value 数值
 * @param min 最小值
 * @returns 返回最大值
 */
export const clampMin = (value: number, min: number = 0): number => {
    return Math.max(value, min);
}

/**
 * 获取范围内值
 * 
 * @param value 当前值
 * @param min 最小值
 * @param max 最大值
 * @returns 返回范围内值
 */
export const clamp = (value: number, min: number, max: number): number => {
    return Math.min(max, Math.max(value, min));
}

type UnitType = { value: number; symbol: string };

/**
 * 将数字格式化为 “最多 4 字符” 的带单位字符串
 * 支持：千 (K)、万、千万、亿、千亿
 */
export const formatWithCustomUnits=(num: number): string=> {
  // 小于 1000 直接返回原始数字
  if (num < 1_000) return `${num}`;

  // 从大到小的单位列表
  const units: UnitType[] = [
    { value: 1e11, symbol: '千亿' },
    { value: 1e8,  symbol: '亿'   },
    { value: 1e7,  symbol: '千万' },
    { value: 1e4,  symbol: '万'   },
    { value: 1e3,  symbol: '千'   },
  ];

  for (const { value, symbol } of units) {
    if (num >= value) {
      // 整数部分
      const intPart = Math.floor(num / value);
      const intStr = `${intPart}${symbol}`;

      // 优先尝试只显示整数
      if (intStr.length <= 4) {
        return intStr;
      }

      // 如果整数部分只有 1 位（可尝试一位小数）
      if (intPart < 10) {
        const oneDecimal = Math.floor((num / value) * 10) / 10;
        const decStr = `${oneDecimal}${symbol}`;
        if (decStr.length <= 4) {
          return decStr;
        }
      }
      // 本单位显示不下，继续尝试下一个小单位
    }
  }

  // 都不满足则返回完整数字
  return `${num}`;
}

export const playerColors = ['#2ad41a', '#04aef8', '#f780c6'];
// export const petColors = ['#02c911','#04aef8','#f780c6'];
export const monsterColors = ['#410a0a', '#3f3f3d', '#abbbb9'];
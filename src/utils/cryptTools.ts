import pako from 'pako';
import CryptoJS from 'crypto-js';

const SECRET_KEY: string = "People who don't want to be slaves";

// 加密函数：压缩 + AES-256-CBC 加密
export function encryptData(data: string, keyStr: string = SECRET_KEY): string {
  // 1. 使用pako进行gzip压缩
  const compressed = pako.deflate(data);

  // 2. 将Uint8Array转为CryptoJS可处理的WordArray
  const compressedWordArray = CryptoJS.lib.WordArray.create(
    compressed.buffer,
    compressed.byteOffset
  );

  // 3. 使用SHA-256处理密钥（生成256位密钥）
  const key = CryptoJS.SHA256(keyStr);

  // 4. 生成随机初始化向量（IV，16字节）
  const iv = CryptoJS.lib.WordArray.random(16);

  // 5. AES加密配置
  const options = {
    iv: iv,
    mode: CryptoJS.mode.CBC,        // CBC模式
    padding: CryptoJS.pad.Pkcs7     // PKCS7填充
  };

  // 6. 执行加密
  const encrypted = CryptoJS.AES.encrypt(compressedWordArray, key, options);

  // 7. 合并IV和密文并转为Base64
  return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
}

// 解密函数：解密 + 解压缩
export function decryptData(encryptedBase64: string, keyStr: string = SECRET_KEY): string {
  // 1. 处理密钥（与加密一致）
  const key = CryptoJS.SHA256(keyStr);

  // 2. 解析Base64数据
  const ivAndCiphertext = CryptoJS.enc.Base64.parse(encryptedBase64);

  // 3. 分离IV（前16字节）和密文
  const iv = CryptoJS.lib.WordArray.create(
    ivAndCiphertext.words.slice(0, 4), // 每个word为4字节
    16 // IV长度16字节
  );
  const ciphertext = CryptoJS.lib.WordArray.create(
    ivAndCiphertext.words.slice(4),
    ivAndCiphertext.sigBytes - 16
  );

  // 4. AES解密配置
  const options = {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  };

  // 5. 执行解密
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: ciphertext } as CryptoJS.lib.CipherParams, // 封装为CipherParams
    key,
    options
  );

  // 6. 将解密结果转为Uint8Array
  const decryptedArray = wordArrayToUint8Array(decrypted);

  // 7. 解压缩并返回原始字符串
  return pako.inflate(decryptedArray, { to: 'string' });
}

// 工具函数：CryptoJS WordArray 转 Uint8Array
function wordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray): Uint8Array {
  const words = wordArray.words;
  const sigBytes = wordArray.sigBytes;
  const u8 = new Uint8Array(sigBytes);

  for (let i = 0; i < sigBytes; i++) {
    u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }
  return u8;
}

/**
 * 生成一个随机唯一 ID（UUID v4）。
 * @returns `{string}` 形如 '3fa85f64-5717-4562-b3fc-2c963f66afa6'
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    // 现代浏览器、Node18+ 原生支持
    return crypto.randomUUID();
  }

  // 回退实现：UUID v4
  // 参考 RFC4122 §4.4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0x0f) >> 0;
    // y: 8,9,a,b
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

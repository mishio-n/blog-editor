/**
 * プロキシサーバー設定
 * CORS制限を回避するためのプロキシサービス設定
 */

export interface ProxyConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

// 利用可能なプロキシサーバー（優先順）
export const PROXY_SERVERS = [
  'https://api.allorigins.win/get?url=',
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/',
] as const;

export const PROXY_CONFIG: ProxyConfig = {
  baseUrl: PROXY_SERVERS[0], // デフォルトはallorigins
  timeout: 10000, // 10秒
  retryAttempts: 2,
  retryDelay: 1000, // 1秒
};

/**
 * プロキシURLを構築
 * @param targetUrl - 取得対象のURL
 * @param proxyIndex - 使用するプロキシサーバーのインデックス
 * @returns プロキシ経由のURL
 */
export function buildProxyUrl(targetUrl: string, proxyIndex = 0): string {
  const proxyBase = PROXY_SERVERS[proxyIndex];
  
  if (proxyBase.includes('allorigins')) {
    return `${proxyBase}${encodeURIComponent(targetUrl)}`;
  }
  
  return `${proxyBase}${encodeURIComponent(targetUrl)}`;
}

/**
 * URL検証
 * @param url - 検証するURL
 * @returns 有効なURLかどうか
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}
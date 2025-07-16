import { buildProxyUrl, PROXY_CONFIG, PROXY_SERVERS, isValidUrl } from '../config/proxyConfig';

/**
 * Open Graph画像情報
 */
export interface OGImageData {
  url: string;
  title?: string;
  description?: string;
  siteName?: string;
  width?: number;
  height?: number;
}

/**
 * OG画像取得結果
 */
export interface OGImageResult {
  success: boolean;
  data?: OGImageData;
  error?: string;
  fromCache?: boolean;
}

/**
 * キャッシュエントリ
 */
interface CacheEntry {
  data: OGImageData;
  timestamp: number;
  expiry: number;
}

/**
 * OG画像取得サービス
 */
class OGImageService {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30分
  private readonly MAX_CACHE_SIZE = 100;

  /**
   * 外部URLからOG画像データを取得
   * @param url - 取得対象のURL
   * @returns Promise<OGImageResult>
   */
  async fetchOGImage(url: string): Promise<OGImageResult> {
    // URL検証
    if (!isValidUrl(url)) {
      return {
        success: false,
        error: '無効なURLです',
      };
    }

    // キャッシュ確認
    const cached = this.getFromCache(url);
    if (cached) {
      return {
        success: true,
        data: cached,
        fromCache: true,
      };
    }

    // OG画像データ取得試行
    for (let proxyIndex = 0; proxyIndex < PROXY_SERVERS.length; proxyIndex++) {
      for (let attempt = 0; attempt <= PROXY_CONFIG.retryAttempts; attempt++) {
        try {
          const result = await this.fetchWithProxy(url, proxyIndex);
          if (result.success && result.data) {
            this.saveToCache(url, result.data);
            return result;
          }
        } catch (error) {
          console.warn(`OG画像取得失敗 (プロキシ${proxyIndex}, 試行${attempt + 1}):`, error);
          
          if (attempt < PROXY_CONFIG.retryAttempts) {
            await this.delay(PROXY_CONFIG.retryDelay);
          }
        }
      }
    }

    return {
      success: false,
      error: 'OG画像の取得に失敗しました',
    };
  }

  /**
   * プロキシ経由でOG画像データを取得
   * @param url - 取得対象のURL
   * @param proxyIndex - プロキシサーバーのインデックス
   * @returns Promise<OGImageResult>
   */
  private async fetchWithProxy(url: string, proxyIndex: number): Promise<OGImageResult> {
    const proxyUrl = buildProxyUrl(url, proxyIndex);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PROXY_CONFIG.timeout);

    try {
      const response = await fetch(proxyUrl, {
        signal: controller.signal,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let html: string;
      
      // alloriginsの場合は特別な処理
      if (PROXY_SERVERS[proxyIndex].includes('allorigins')) {
        const json = await response.json();
        html = json.contents;
      } else {
        html = await response.text();
      }

      const ogData = this.parseOGData(html);
      
      if (!ogData.url) {
        return {
          success: false,
          error: 'OG画像が見つかりませんでした',
        };
      }

      return {
        success: true,
        data: ogData,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * HTMLからOpen Graphデータを解析
   * @param html - 解析対象のHTML
   * @returns OGImageData
   */
  private parseOGData(html: string): OGImageData {
    const ogData: Partial<OGImageData> = {};

    // メタタグのパターンマッチング
    const metaPatterns = {
      image: /<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i,
      title: /<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i,
      description: /<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i,
      siteName: /<meta[^>]*property="og:site_name"[^>]*content="([^"]*)"[^>]*>/i,
      width: /<meta[^>]*property="og:image:width"[^>]*content="([^"]*)"[^>]*>/i,
      height: /<meta[^>]*property="og:image:height"[^>]*content="([^"]*)"[^>]*>/i,
    };

    // 各プロパティを抽出
    for (const [key, pattern] of Object.entries(metaPatterns)) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const value = match[1].trim();
        if (key === 'width' || key === 'height') {
          ogData[key as 'width' | 'height'] = parseInt(value, 10) || undefined;
        } else {
          (ogData as Record<string, string>)[key] = value;
        }
      }
    }

    // タイトルがない場合はtitleタグから取得
    if (!ogData.title) {
      const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        ogData.title = titleMatch[1].trim();
      }
    }

    return ogData as OGImageData;
  }

  /**
   * キャッシュから取得
   * @param url - URL
   * @returns OGImageData | null
   */
  private getFromCache(url: string): OGImageData | null {
    const entry = this.cache.get(url);
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.expiry) {
      this.cache.delete(url);
      return null;
    }

    return entry.data;
  }

  /**
   * キャッシュに保存
   * @param url - URL
   * @param data - OG画像データ
   */
  private saveToCache(url: string, data: OGImageData): void {
    // キャッシュサイズ制限
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    const now = Date.now();
    this.cache.set(url, {
      data,
      timestamp: now,
      expiry: now + this.CACHE_DURATION,
    });
  }

  /**
   * 遅延処理
   * @param ms - 遅延時間（ミリ秒）
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * キャッシュクリア
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// シングルトンインスタンス
export const ogImageService = new OGImageService();
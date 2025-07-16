/**
 * Markdownからリンクを抽出するユーティリティ
 */

export interface MarkdownLink {
  url: string;
  title?: string;
  text: string;
  isExternal: boolean;
}

/**
 * Markdownテキストからリンクを抽出
 * @param markdown - Markdownテキスト
 * @returns MarkdownLink[] - 抽出されたリンクの配列
 */
export function extractLinksFromMarkdown(markdown: string): MarkdownLink[] {
  const links: MarkdownLink[] = [];
  
  // Markdownリンクのパターン: [text](url "title")
  const linkPattern = /\[([^\]]*)\]\(([^)]+)(?:\s+"([^"]*)")?\)/g;
  
  let match: RegExpExecArray | null;
  while ((match = linkPattern.exec(markdown)) !== null) {
    const [, text, url, title] = match;
    
    if (url && text) {
      links.push({
        url: url.trim(),
        title: title?.trim(),
        text: text.trim(),
        isExternal: isExternalUrl(url.trim()),
      });
    }
  }
  
  // HTMLリンクのパターン: <a href="url">text</a>
  const htmlLinkPattern = /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([^<]*)<\/a>/gi;
  
  while ((match = htmlLinkPattern.exec(markdown)) !== null) {
    const [, url, text] = match;
    
    if (url && text) {
      const linkUrl = url.trim();
      // 重複チェック
      const exists = links.some(link => link.url === linkUrl);
      if (!exists) {
        links.push({
          url: linkUrl,
          text: text.trim(),
          isExternal: isExternalUrl(linkUrl),
        });
      }
    }
  }
  
  return links;
}

/**
 * 外部URLかどうかを判定
 * @param url - 判定するURL
 * @returns boolean - 外部URLの場合true
 */
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * URLを正規化
 * @param url - 正規化するURL
 * @returns string - 正規化されたURL
 */
export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.href;
  } catch {
    return url;
  }
}

/**
 * ユニークなリンクのみを抽出
 * @param links - リンクの配列
 * @returns MarkdownLink[] - ユニークなリンクの配列
 */
export function getUniqueLinks(links: MarkdownLink[]): MarkdownLink[] {
  const seen = new Set<string>();
  return links.filter(link => {
    const normalizedUrl = normalizeUrl(link.url);
    if (seen.has(normalizedUrl)) {
      return false;
    }
    seen.add(normalizedUrl);
    return true;
  });
}

/**
 * 外部リンクのみを抽出
 * @param links - リンクの配列
 * @returns MarkdownLink[] - 外部リンクの配列
 */
export function getExternalLinks(links: MarkdownLink[]): MarkdownLink[] {
  return links.filter(link => link.isExternal);
}
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDebounce } from "../../hooks/useDebounce";
import { useOGImageSettings } from "../../hooks/useOGImageSettings";
import { extractLinksFromMarkdown, getExternalLinks, getUniqueLinks } from "../../utils/linkExtractor";
import { OGImageCard } from "./OGImageCard";

interface HtmlPreviewProps {
  markdown: string;
  customCSS?: string;
  onScroll?: () => void;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export const HtmlPreview: React.FC<HtmlPreviewProps> = ({
  markdown,
  customCSS = "",
  onScroll,
  scrollRef,
  className = "",
}) => {
  const [html, setHtml] = useState<string>("");
  const { settings: ogSettings } = useOGImageSettings();
  
  // パフォーマンス最適化: Markdownをデバウンス（300ms遅延）
  const debouncedMarkdown = useDebounce(markdown, 300);

  // 外部リンクの抽出とOG画像表示対象の選定
  const externalLinks = useMemo(() => {
    if (!ogSettings.enabled || !ogSettings.showInPreview || !debouncedMarkdown.trim()) {
      return [];
    }

    const allLinks = extractLinksFromMarkdown(debouncedMarkdown);
    const uniqueExternalLinks = getUniqueLinks(getExternalLinks(allLinks));
    
    // 最大画像数でフィルタリング
    return uniqueExternalLinks.slice(0, ogSettings.maxImagesPerPage);
  }, [debouncedMarkdown, ogSettings.enabled, ogSettings.showInPreview, ogSettings.maxImagesPerPage]);

  // react-markdownを使用するため、HTML変換は不要
  // 代わりにHTMLコピー機能のためにMarkdownからHTMLを生成
  const generateHtml = async () => {
    if (!debouncedMarkdown.trim()) return "";
    try {
      // processMarkdownをHTMLコピー用にのみ使用
      const { processMarkdown } = await import("../../utils/markdownProcessor");
      return await processMarkdown(debouncedMarkdown);
    } catch (err) {
      console.error("HTML生成エラー:", err);
      return "";
    }
  };

  const handleCopyHtml = async () => {
    try {
      const htmlContent = await generateHtml();
      await navigator.clipboard.writeText(htmlContent);
      setHtml(htmlContent); // 表示用に保存
      console.log("HTMLをクリップボードにコピーしました");
    } catch (err) {
      console.error("コピーに失敗しました:", err);
    }
  };

  // Markdown レンダリングをメモ化してパフォーマンス最適化
  const renderedMarkdown = useMemo(() => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-vscode-primary text-2xl font-bold mb-4">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-vscode-primary text-xl font-bold mb-3">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-vscode-primary text-lg font-bold mb-2">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-vscode-primary text-base font-bold mb-2">
            {children}
          </h4>
        ),
        h5: ({ children }) => (
          <h5 className="text-vscode-primary text-sm font-bold mb-1">
            {children}
          </h5>
        ),
        h6: ({ children }) => (
          <h6 className="text-vscode-primary text-xs font-bold mb-1">
            {children}
          </h6>
        ),
        p: ({ children }) => (
          <p className="text-vscode-primary mb-4">{children}</p>
        ),
        a: ({ children, href }) => {
          // OG画像が有効でかつ外部リンクの場合、OGImageCardで表示
          if (ogSettings.enabled && ogSettings.showInPreview && href && 
              externalLinks.some(link => link.url === href)) {
            return (
              <OGImageCard
                url={href}
                linkText={typeof children === 'string' ? children : href}
                className="my-4"
              />
            );
          }
          
          // 通常のリンク表示
          return (
            <a
              href={href}
              className="text-blue-400 hover:text-blue-300 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        },
        code: ({ children }) => (
          <code className="bg-vscode-tertiary text-vscode-primary px-1 py-0.5 rounded text-sm font-mono">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-vscode-tertiary text-vscode-primary p-3 rounded text-sm font-mono overflow-x-auto">
            {children}
          </pre>
        ),
        blockquote: ({ children }) => (
          <blockquote className="text-vscode-secondary border-l-4 border-vscode-accent pl-4 italic">
            {children}
          </blockquote>
        ),
        ul: ({ children }) => (
          <ul className="text-vscode-primary list-disc list-inside mb-4">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="text-vscode-primary list-decimal list-inside mb-4">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-vscode-primary mb-1">{children}</li>
        ),
        table: ({ children }) => (
          <table className="text-vscode-primary border-collapse border border-vscode w-full mb-4">
            {children}
          </table>
        ),
        th: ({ children }) => (
          <th className="text-vscode-primary border border-vscode px-2 py-1 bg-vscode-tertiary font-bold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="text-vscode-primary border border-vscode px-2 py-1">
            {children}
          </td>
        ),
      }}
    >
      {debouncedMarkdown}
    </ReactMarkdown>
  ), [debouncedMarkdown, externalLinks, ogSettings.enabled, ogSettings.showInPreview]);

  return (
    <div
      className={`border border-vscode rounded-lg h-full flex flex-col bg-vscode-primary ${className}`}
    >
      <div className="border-b border-vscode p-2 flex justify-between items-center bg-vscode-secondary flex-shrink-0">
        <h3 className="font-medium text-vscode-primary">プレビュー</h3>
        <button
          type="button"
          onClick={handleCopyHtml}
          className="px-3 py-1 text-sm bg-vscode-input text-vscode-primary border border-vscode-input rounded hover:opacity-80 disabled:opacity-50 transition-opacity"
          disabled={!debouncedMarkdown.trim()}
        >
          HTMLをコピー
        </button>
      </div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="p-4 flex-1 overflow-auto vscode-scrollbar"
        data-preview-content
      >
        <style data-custom-css>{customCSS}</style>
        <div className="prose prose-invert max-w-none text-vscode-primary vscode-selection">
          {renderedMarkdown}
        </div>

        {/* OG画像カード一覧（Markdown内のリンクとは別に表示） */}
        {ogSettings.enabled && ogSettings.showInPreview && externalLinks.length > 0 && (
          <div className="mt-8 pt-6 border-t border-vscode">
            <h3 className="text-vscode-primary text-lg font-medium mb-4">
              🔗 外部リンクプレビュー
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {externalLinks.map((link, index) => (
                <OGImageCard
                  key={`${link.url}-${index}`}
                  url={link.url}
                  linkText={link.text}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {html && (
        <details className="border-t border-vscode flex-shrink-0">
          <summary className="p-2 bg-vscode-secondary text-vscode-primary cursor-pointer hover:bg-vscode-tertiary">
            生成されたHTML
          </summary>
          <pre className="p-4 bg-vscode-tertiary text-vscode-primary text-sm overflow-auto max-h-40 vscode-scrollbar">
            <code>{html}</code>
          </pre>
        </details>
      )}
    </div>
  );
};

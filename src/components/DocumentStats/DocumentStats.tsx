import type React from "react";
import { useMemo } from "react";

interface DocumentStatsProps {
  markdown: string;
  className?: string;
}

export const DocumentStats: React.FC<DocumentStatsProps> = ({
  markdown,
  className = "",
}) => {
  const stats = useMemo(() => {
    const words = markdown
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const characters = markdown.length;
    const charactersNoSpaces = markdown.replace(/\s/g, "").length;
    const lines = markdown.split("\n").length;
    const paragraphs = markdown
      .split(/\n\s*\n/)
      .filter((p) => p.trim().length > 0).length;

    // 見出しの数をカウント
    const headings = (markdown.match(/^#{1,6}\s/gm) || []).length;

    // リストアイテムの数をカウント
    const listItems = (markdown.match(/^[\s]*[-*+]\s/gm) || []).length;

    // コードブロックの数をカウント
    const codeBlocks = (markdown.match(/```[\s\S]*?```/g) || []).length;

    // リンクの数をカウント
    const links = (markdown.match(/\[.*?\]\(.*?\)/g) || []).length;

    return {
      words,
      characters,
      charactersNoSpaces,
      lines,
      paragraphs,
      headings,
      listItems,
      codeBlocks,
      links,
    };
  }, [markdown]);

  const readingTime = Math.max(1, Math.ceil(stats.words / 200)); // 1分間に200語として計算

  return (
    <div className={`text-sm text-vscode-secondary space-y-1 ${className}`}>
      <div className="font-semibold text-vscode-primary mb-2">📊 文書統計</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <div>
          単語数:{" "}
          <span className="font-mono text-vscode-primary">
            {stats.words.toLocaleString()}
          </span>
        </div>
        <div>
          文字数:{" "}
          <span className="font-mono text-vscode-primary">
            {stats.characters.toLocaleString()}
          </span>
        </div>
        <div>
          文字数(空白除く):{" "}
          <span className="font-mono text-vscode-primary">
            {stats.charactersNoSpaces.toLocaleString()}
          </span>
        </div>
        <div>
          行数:{" "}
          <span className="font-mono text-vscode-primary">
            {stats.lines.toLocaleString()}
          </span>
        </div>
        <div>
          段落数:{" "}
          <span className="font-mono text-vscode-primary">
            {stats.paragraphs.toLocaleString()}
          </span>
        </div>
        <div>
          見出し数:{" "}
          <span className="font-mono text-vscode-primary">
            {stats.headings.toLocaleString()}
          </span>
        </div>
        <div>
          リスト項目:{" "}
          <span className="font-mono text-vscode-primary">
            {stats.listItems.toLocaleString()}
          </span>
        </div>
        <div>
          コードブロック:{" "}
          <span className="font-mono text-vscode-primary">
            {stats.codeBlocks.toLocaleString()}
          </span>
        </div>
        <div>
          リンク数:{" "}
          <span className="font-mono text-vscode-primary">
            {stats.links.toLocaleString()}
          </span>
        </div>
        <div>
          読了時間:{" "}
          <span className="font-mono text-vscode-primary">
            約{readingTime}分
          </span>
        </div>
      </div>
    </div>
  );
};

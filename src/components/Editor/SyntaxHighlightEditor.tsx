import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import {
  vs,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../../hooks/useTheme";

// Markdownサポートの追加
SyntaxHighlighter.registerLanguage("markdown", markdown);

interface SyntaxHighlightEditorProps {
  value: string;
  onChange?: (markdown: string) => void;
  onScroll?: () => void;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  placeholder?: string;
  className?: string;
  showLineNumbers?: boolean;
  fontSize?: number;
  lineHeight?: number;
  wordWrap?: boolean;
}

export const SyntaxHighlightEditor: React.FC<SyntaxHighlightEditorProps> = ({
  value,
  onChange,
  onScroll,
  scrollRef,
  placeholder = "Markdownで入力...",
  className = "",
  showLineNumbers = false,
  fontSize = 14,
  lineHeight = 1.6,
  wordWrap = true,
}) => {
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const lineCount = value.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  // スクロール同期
  const syncScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      const textarea = textareaRef.current;
      const highlight = highlightRef.current;

      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
    }
  }, []);

  // 外部からのスクロール同期
  useEffect(() => {
    if (scrollRef?.current && textareaRef.current) {
      const scrollElement = scrollRef.current;
      const textarea = textareaRef.current;

      const handleExternalScroll = () => {
        if (textarea && scrollElement) {
          textarea.scrollTop = scrollElement.scrollTop;
          syncScroll();
        }
      };

      scrollElement.addEventListener("scroll", handleExternalScroll);
      return () => {
        scrollElement.removeEventListener("scroll", handleExternalScroll);
      };
    }
  }, [scrollRef, syncScroll]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  const handleTextareaScroll = () => {
    syncScroll();

    // scrollRefに同期
    if (scrollRef?.current && textareaRef.current) {
      scrollRef.current.scrollTop = textareaRef.current.scrollTop;
    }

    // 行番号のスクロール同期
    if (showLineNumbers) {
      const lineNumbersElement = document.querySelector(".line-numbers");
      if (lineNumbersElement && textareaRef.current) {
        lineNumbersElement.scrollTop = textareaRef.current.scrollTop;
      }
    }

    onScroll?.();
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const editorStyle = {
    fontSize: `${fontSize}px`,
    lineHeight: lineHeight,
    whiteSpace: wordWrap ? ("pre-wrap" as const) : ("pre" as const),
    wordWrap: wordWrap ? ("break-word" as const) : ("normal" as const),
  };

  // シンタックスハイライターのスタイルをテーマに応じて選択
  const syntaxStyle = theme === "dark" ? vscDarkPlus : vs;

  return (
    <div className={`h-full flex bg-vscode-editor ${className}`}>
      {showLineNumbers && (
        <div
          className="line-numbers bg-vscode-tertiary border-r border-vscode px-2 py-4 text-right text-vscode-line-number select-none overflow-hidden vscode-scrollbar"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            minWidth: `${String(lineCount).length * 0.6 + 1}em`,
          }}
        >
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>
      )}

      <div className="flex-1 relative" ref={containerRef}>
        {/* シンタックスハイライト表示用のレイヤー */}
        <div
          ref={highlightRef}
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            ...editorStyle,
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          }}
        >
          <SyntaxHighlighter
            language="markdown"
            style={syntaxStyle}
            customStyle={{
              margin: 0,
              padding: "1rem",
              background: "transparent",
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              whiteSpace: wordWrap ? "pre-wrap" : "pre",
              wordWrap: wordWrap ? "break-word" : "normal",
              overflow: "visible",
            }}
            lineNumberStyle={{
              display: "none",
            }}
            showLineNumbers={false}
            wrapLines={wordWrap}
            wrapLongLines={wordWrap}
          >
            {value || " "}
          </SyntaxHighlighter>
        </div>

        {/* 編集用のテキストエリア */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onScroll={handleTextareaScroll}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`absolute inset-0 p-4 font-mono text-sm border-0 outline-none resize-none bg-transparent text-transparent caret-vscode-primary vscode-scrollbar vscode-selection placeholder-vscode-muted ${
            isFocused ? "z-10" : "z-0"
          }`}
          style={{
            minHeight: "100%",
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            ...editorStyle,
            // テキストを透明にしてシンタックスハイライトを背景に表示
            color: "transparent",
            // カーソルとセレクションは表示
            caretColor: "var(--vscode-primary)",
          }}
          spellCheck={false}
        />

        {/* プレースホルダー表示 */}
        {!value && !isFocused && (
          <div
            className="absolute pointer-events-none text-vscode-muted p-4"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            }}
          >
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

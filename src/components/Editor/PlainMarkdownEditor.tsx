import type React from "react";
import { useEffect, useRef } from "react";

interface PlainMarkdownEditorProps {
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

export const PlainMarkdownEditor: React.FC<PlainMarkdownEditorProps> = ({
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lineCount = value.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  // スクロール参照の同期
  useEffect(() => {
    const textarea = textareaRef.current;
    if (scrollRef && textarea) {
      const handleScroll = () => {
        if (onScroll) {
          onScroll();
        }
      };

      textarea.addEventListener("scroll", handleScroll);
      return () => {
        textarea.removeEventListener("scroll", handleScroll);
      };
    }
  }, [scrollRef, onScroll]);

  // スクロール位置の同期
  useEffect(() => {
    if (scrollRef?.current && textareaRef.current) {
      const scrollElement = scrollRef.current;
      const textarea = textareaRef.current;

      // scrollRefのスクロール位置をtextareaに反映
      const handleExternalScroll = () => {
        if (textarea && scrollElement) {
          textarea.scrollTop = scrollElement.scrollTop;
        }
      };

      scrollElement.addEventListener("scroll", handleExternalScroll);
      return () => {
        scrollElement.removeEventListener("scroll", handleExternalScroll);
      };
    }
  }, [scrollRef]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  const handleTextareaScroll = () => {
    // textareaのスクロールをscrollRefに同期
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

  const editorStyle = {
    fontSize: `${fontSize}px`,
    lineHeight: lineHeight,
    whiteSpace: wordWrap ? ("pre-wrap" as const) : ("pre" as const),
    wordWrap: wordWrap ? ("break-word" as const) : ("normal" as const),
  };

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
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onScroll={handleTextareaScroll}
        placeholder={placeholder}
        spellCheck={false}
        className="flex-1 p-4 font-mono text-sm border-0 outline-none resize-none bg-vscode-editor text-vscode-primary vscode-scrollbar vscode-selection placeholder-vscode-muted"
        style={{
          minHeight: "100%",
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          ...editorStyle,
        }}
      />
    </div>
  );
};

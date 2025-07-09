import type React from "react";
import { useState } from "react";

interface CSSEditorProps {
  value: string;
  onChange: (css: string) => void;
  className?: string;
}

export const CSSEditor: React.FC<CSSEditorProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const defaultCSS = `/* カスタムCSS */
.prose {
  max-width: none;
  line-height: 1.6;
}

.prose h1 {
  color: #1f2937;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.prose h2 {
  color: #374151;
  margin-top: 2rem;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.prose pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.prose blockquote {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  margin-left: 0;
  font-style: italic;
  color: #6b7280;
}`;

  const handleReset = () => {
    onChange(defaultCSS);
  };

  return (
    <div
      className={`border border-vscode rounded-lg bg-vscode-primary ${className}`}
    >
      <div className="border-b border-vscode p-2 bg-vscode-secondary flex justify-between items-center">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-sm font-medium text-vscode-primary hover:text-vscode-secondary"
        >
          <span>{isExpanded ? "▼" : "▶"}</span>
          <span>カスタムCSS</span>
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-2 py-1 text-xs bg-vscode-input text-vscode-primary border border-vscode-input rounded hover:opacity-80 transition-opacity"
        >
          リセット
        </button>
      </div>

      {isExpanded && (
        <div className="p-0">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-64 p-3 font-mono text-sm border-0 resize-none focus:outline-none bg-vscode-editor text-vscode-primary vscode-scrollbar placeholder-vscode-muted"
            placeholder="/* カスタムCSSを入力してください */"
          />
        </div>
      )}
    </div>
  );
};

import type React from "react";
import { useRef } from "react";

interface FileOperationsProps {
  markdown: string;
  onLoad: (content: string, filename?: string) => void;
  onSave?: (content: string, filename?: string) => void;
}

export const FileOperations: React.FC<FileOperationsProps> = ({
  markdown,
  onLoad,
  onSave,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onLoad(content, file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleSaveFile = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onSave?.(markdown, "document.md");
  };

  const handleExportHtml = () => {
    // HTMLプレビューの内容を取得してエクスポート
    const previewElement = document.querySelector("[data-preview-content]");
    if (previewElement) {
      const htmlContent = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Document</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        ${document.querySelector("[data-custom-css]")?.textContent || ""}
    </style>
</head>
<body>
    ${previewElement.innerHTML}
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleLoadFile}
        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        title="Markdownファイルを読み込み"
      >
        📁 開く
      </button>
      <button
        type="button"
        onClick={handleSaveFile}
        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        title="Markdownファイルとして保存"
      >
        💾 保存
      </button>
      <button
        type="button"
        onClick={handleExportHtml}
        className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        title="HTMLファイルとしてエクスポート"
      >
        🌐 HTML出力
      </button>
    </div>
  );
};

import React from "react";
import { useTheme } from "../../hooks/useTheme";
import type { EditorMode } from "../../types";

interface ToolbarProps {
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  onFileLoad?: (content: string, filename?: string) => void;
  onSave?: () => void;
  onExportHtml?: () => void;
  onOpenSettings?: () => void;
  currentFile?: {
    name: string;
    isModified: boolean;
  } | null;
  autoSaveStatus?: {
    isSaving: boolean;
    lastSaved: Date | null;
    hasUnsavedChanges: boolean;
  };
  className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  mode,
  onModeChange,
  onFileLoad,
  onSave,
  onExportHtml,
  onOpenSettings,
  currentFile,
  autoSaveStatus,
  className = "",
}) => {
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleLoadFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileLoad?.(content, file.name);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div
      className={`border-b border-vscode bg-vscode-toolbar text-vscode-primary p-3 flex items-center justify-between ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-vscode-primary">
            Markdown Blog Editor
          </h1>
          {currentFile && (
            <div className="flex items-center space-x-1 text-sm text-vscode-secondary">
              <span>-</span>
              <span className="text-vscode-primary">
                {currentFile.name}
                {currentFile.isModified && (
                  <span className="text-yellow-500 ml-1">●</span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* ファイル操作ボタン */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleLoadFile}
            className="px-3 py-1 text-sm bg-vscode-input text-vscode-primary border border-vscode-input rounded hover:opacity-80 transition-opacity"
            title="Markdownファイルを開く"
          >
            📁
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-3 py-1 text-sm bg-vscode-input text-vscode-primary border border-vscode-input rounded hover:opacity-80 transition-opacity"
            title="Markdownファイルとして保存"
          >
            💾
          </button>
          <button
            type="button"
            onClick={onExportHtml}
            className="px-3 py-1 text-sm bg-vscode-input text-vscode-primary border border-vscode-input rounded hover:opacity-80 transition-opacity"
            title="HTMLファイルとしてエクスポート"
          >
            🌐
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            className="px-3 py-1 text-sm bg-vscode-input text-vscode-primary border border-vscode-input rounded hover:opacity-80 transition-opacity"
            title="設定を開く"
          >
            ⚙️
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="px-3 py-1 text-sm bg-vscode-input text-vscode-primary border border-vscode-input rounded hover:opacity-80 transition-opacity"
            title={`${theme === "light" ? "ダーク" : "ライト"}モードに切替`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* 自動保存ステータス */}
        {autoSaveStatus && (
          <div className="text-sm text-vscode-secondary">
            {autoSaveStatus.isSaving && (
              <span className="flex items-center space-x-1">
                <span className="animate-spin">⟳</span>
                <span>保存中...</span>
              </span>
            )}
            {!autoSaveStatus.isSaving && autoSaveStatus.lastSaved && (
              <span
                title={`最終保存: ${autoSaveStatus.lastSaved.toLocaleTimeString()}`}
              >
                💾 保存済み
              </span>
            )}
            {autoSaveStatus.hasUnsavedChanges && !autoSaveStatus.isSaving && (
              <span className="text-yellow-500">未保存の変更</span>
            )}
          </div>
        )}

        <span className="text-sm text-vscode-secondary">モード:</span>
        <div className="flex bg-vscode-input border border-vscode-input rounded-lg p-1">
          <button
            type="button"
            onClick={() => onModeChange("wysiwyg")}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              mode === "wysiwyg"
                ? "bg-blue-500 text-white"
                : "text-vscode-primary hover:bg-vscode-secondary"
            }`}
          >
            WYSIWYG
          </button>
          <button
            type="button"
            onClick={() => onModeChange("plaintext")}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              mode === "plaintext"
                ? "bg-blue-500 text-white"
                : "text-vscode-primary hover:bg-vscode-secondary"
            }`}
          >
            Markdown
          </button>
        </div>
      </div>
    </div>
  );
};

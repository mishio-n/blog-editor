import type React from "react";
import { useState } from "react";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    theme: "light" | "dark";
    fontSize: number;
    lineHeight: number;
    wordWrap: boolean;
    showLineNumbers: boolean;
    autoSave: boolean;
    syntaxHighlight: boolean;
  };
  onSettingsChange: (settings: SettingsPanelProps["settings"]) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSettingChange = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K]
  ) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-vscode-primary border border-vscode rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto shadow-vscode">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-vscode-primary">⚙️ 設定</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-vscode-secondary hover:text-vscode-primary text-xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* テーマ設定 */}
          <div>
            <label
              htmlFor="theme-select"
              className="block text-sm font-medium mb-2 text-vscode-primary"
            >
              テーマ
            </label>
            <select
              id="theme-select"
              value={localSettings.theme}
              onChange={(e) =>
                handleSettingChange("theme", e.target.value as "light" | "dark")
              }
              className="w-full p-2 border border-vscode-input bg-vscode-input text-vscode-primary rounded"
            >
              <option value="light">ライト</option>
              <option value="dark">ダーク</option>
            </select>
          </div>

          {/* フォントサイズ */}
          <div>
            <label
              htmlFor="font-size"
              className="block text-sm font-medium mb-2 text-vscode-primary"
            >
              フォントサイズ: {localSettings.fontSize}px
            </label>
            <input
              id="font-size"
              type="range"
              min="12"
              max="24"
              value={localSettings.fontSize}
              onChange={(e) =>
                handleSettingChange("fontSize", Number(e.target.value))
              }
              className="w-full"
            />
          </div>

          {/* 行の高さ */}
          <div>
            <label
              htmlFor="line-height"
              className="block text-sm font-medium mb-2 text-vscode-primary"
            >
              行の高さ: {localSettings.lineHeight}
            </label>
            <input
              id="line-height"
              type="range"
              min="1.2"
              max="2.0"
              step="0.1"
              value={localSettings.lineHeight}
              onChange={(e) =>
                handleSettingChange("lineHeight", Number(e.target.value))
              }
              className="w-full"
            />
          </div>

          {/* 折り返し */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="wordWrap"
              checked={localSettings.wordWrap}
              onChange={(e) =>
                handleSettingChange("wordWrap", e.target.checked)
              }
              className="mr-2"
            />
            <label htmlFor="wordWrap" className="text-sm font-medium">
              単語の折り返し
            </label>
          </div>

          {/* 行番号表示 */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showLineNumbers"
              checked={localSettings.showLineNumbers}
              onChange={(e) =>
                handleSettingChange("showLineNumbers", e.target.checked)
              }
              className="mr-2"
            />
            <label
              htmlFor="showLineNumbers"
              className="text-sm font-medium text-vscode-primary"
            >
              行番号を表示
            </label>
          </div>

          {/* 自動保存 */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoSave"
              checked={localSettings.autoSave}
              onChange={(e) =>
                handleSettingChange("autoSave", e.target.checked)
              }
              className="mr-2"
            />
            <label
              htmlFor="autoSave"
              className="text-sm font-medium text-vscode-primary"
            >
              自動保存
            </label>
          </div>

          {/* シンタックスハイライト */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="syntaxHighlight"
              checked={localSettings.syntaxHighlight}
              onChange={(e) =>
                handleSettingChange("syntaxHighlight", e.target.checked)
              }
              className="mr-2"
            />
            <label
              htmlFor="syntaxHighlight"
              className="text-sm font-medium text-vscode-primary"
            >
              シンタックスハイライト
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-vscode-input text-vscode-primary border border-vscode-input rounded hover:opacity-80 transition-opacity"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

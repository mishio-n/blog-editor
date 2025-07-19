import type React from "react";
import { useState } from "react";
import { useOGImageSettings } from "../../hooks/useOGImageSettings";

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
  const { settings: ogSettings, updateSettings: updateOGSettings } = useOGImageSettings();

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

          {/* OG画像設定セクション */}
          <div className="mt-6 pt-4 border-t border-vscode">
            <h3 className="text-lg font-medium text-vscode-primary mb-4">🖼️ OG画像設定</h3>
            
            {/* OG画像表示有効/無効 */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="ogImageEnabled"
                checked={ogSettings.enabled}
                onChange={(e) =>
                  updateOGSettings({ enabled: e.target.checked })
                }
                className="mr-2"
              />
              <label
                htmlFor="ogImageEnabled"
                className="text-sm font-medium text-vscode-primary"
              >
                OG画像表示を有効にする
              </label>
            </div>

            {/* プレビューでのOG画像表示 */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="ogImageShowInPreview"
                checked={ogSettings.showInPreview}
                onChange={(e) =>
                  updateOGSettings({ showInPreview: e.target.checked })
                }
                disabled={!ogSettings.enabled}
                className="mr-2"
              />
              <label
                htmlFor="ogImageShowInPreview"
                className={`text-sm font-medium ${
                  ogSettings.enabled ? 'text-vscode-primary' : 'text-vscode-secondary'
                }`}
              >
                プレビューでOG画像を表示
              </label>
            </div>

            {/* 最大画像数設定 */}
            <div className={ogSettings.enabled ? '' : 'opacity-50'}>
              <label
                htmlFor="maxImagesPerPage"
                className="block text-sm font-medium mb-2 text-vscode-primary"
              >
                ページあたりの最大画像数: {ogSettings.maxImagesPerPage}
              </label>
              <input
                id="maxImagesPerPage"
                type="range"
                min="1"
                max="20"
                value={ogSettings.maxImagesPerPage}
                onChange={(e) =>
                  updateOGSettings({ maxImagesPerPage: Number(e.target.value) })
                }
                disabled={!ogSettings.enabled}
                className="w-full"
              />
            </div>

            {/* キャッシュ設定 */}
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="ogImageCache"
                checked={ogSettings.cacheEnabled}
                onChange={(e) =>
                  updateOGSettings({ cacheEnabled: e.target.checked })
                }
                disabled={!ogSettings.enabled}
                className="mr-2"
              />
              <label
                htmlFor="ogImageCache"
                className={`text-sm font-medium ${
                  ogSettings.enabled ? 'text-vscode-primary' : 'text-vscode-secondary'
                }`}
              >
                OG画像キャッシュを有効にする
              </label>
            </div>
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

import { useState, useEffect } from 'react';

export interface OGImageSettings {
  enabled: boolean;
  showInPreview: boolean;
  maxImagesPerPage: number;
  cacheEnabled: boolean;
}

const DEFAULT_SETTINGS: OGImageSettings = {
  enabled: true,
  showInPreview: true,
  maxImagesPerPage: 10,
  cacheEnabled: true,
};

const STORAGE_KEY = 'blog-editor-og-image-settings';

/**
 * OG画像設定管理フック
 * @returns OG画像設定の状態と更新関数
 */
export function useOGImageSettings() {
  const [settings, setSettings] = useState<OGImageSettings>(DEFAULT_SETTINGS);

  // 初期設定の読み込み
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<OGImageSettings>;
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('OG画像設定の読み込みに失敗しました:', error);
    }
  }, []);

  // 設定の保存
  const saveSettings = (newSettings: Partial<OGImageSettings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('OG画像設定の保存に失敗しました:', error);
    }
  };

  // 設定のリセット
  const resetSettings = () => {
    try {
      setSettings(DEFAULT_SETTINGS);
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('OG画像設定のリセットに失敗しました:', error);
    }
  };

  return {
    settings,
    updateSettings: saveSettings,
    resetSettings,
  };
}
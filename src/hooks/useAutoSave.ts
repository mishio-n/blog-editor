import { useEffect, useRef, useState } from 'react';

interface UseAutoSaveOptions {
  enabled: boolean;
  delay?: number; // デバウンス時間（ミリ秒）
  onSave: () => void;
}

interface AutoSaveStatus {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

export const useAutoSave = (
  content: string,
  options: UseAutoSaveOptions
): AutoSaveStatus => {
  const { enabled, delay = 2000, onSave } = options;
  const timeoutRef = useRef<number | null>(null);
  const lastSavedContentRef = useRef<string>(content);
  const [status, setStatus] = useState<AutoSaveStatus>({
    isSaving: false,
    lastSaved: null,
    hasUnsavedChanges: false,
  });

  useEffect(() => {
    if (!enabled) {
      setStatus(prev => ({ ...prev, hasUnsavedChanges: false }));
      return;
    }

    // 内容が変更されていない場合
    if (content === lastSavedContentRef.current) {
      setStatus(prev => ({ ...prev, hasUnsavedChanges: false }));
      return;
    }

    // 未保存変更があることを示す
    setStatus(prev => ({ ...prev, hasUnsavedChanges: true }));

    // 前のタイマーをクリア
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    // 新しいタイマーを設定
    timeoutRef.current = window.setTimeout(async () => {
      if (content !== lastSavedContentRef.current) {
        setStatus(prev => ({ ...prev, isSaving: true }));
        
        try {
          await onSave();
          lastSavedContentRef.current = content;
          setStatus({
            isSaving: false,
            lastSaved: new Date(),
            hasUnsavedChanges: false,
          });
        } catch (error) {
          console.error('Auto-save failed:', error);
          setStatus(prev => ({ ...prev, isSaving: false }));
        }
      }
    }, delay);

    // クリーンアップ
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [content, enabled, delay, onSave]);

  // 最後に保存した内容を更新（外部からの変更時）
  useEffect(() => {
    lastSavedContentRef.current = content;
    setStatus(prev => ({ ...prev, hasUnsavedChanges: false }));
  }, [content]);

  return status;
};

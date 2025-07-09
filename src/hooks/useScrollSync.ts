import { useCallback, useRef } from 'react';

export const useScrollSync = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const isSyncingRef = useRef<boolean>(false);

  // エディターのスクロールに合わせてプレビューをスクロール
  const syncScrollFromEditor = useCallback(() => {
    if (isSyncingRef.current || !editorRef.current || !previewRef.current) {
      return;
    }

    isSyncingRef.current = true;
    
    const editorElement = editorRef.current;
    const previewElement = previewRef.current;
    
    const editorScrollTop = editorElement.scrollTop;
    const editorScrollHeight = editorElement.scrollHeight - editorElement.clientHeight;
    const previewScrollHeight = previewElement.scrollHeight - previewElement.clientHeight;
    
    if (editorScrollHeight > 0 && previewScrollHeight > 0) {
      const scrollRatio = editorScrollTop / editorScrollHeight;
      const targetScrollTop = scrollRatio * previewScrollHeight;
      
      previewElement.scrollTop = targetScrollTop;
    }
    
    // 同期フラグをリセット（次のフレームで）
    requestAnimationFrame(() => {
      isSyncingRef.current = false;
    });
  }, []);

  // プレビューのスクロールに合わせてエディターをスクロール
  const syncScrollFromPreview = useCallback(() => {
    if (isSyncingRef.current || !editorRef.current || !previewRef.current) {
      return;
    }

    isSyncingRef.current = true;
    
    const editorElement = editorRef.current;
    const previewElement = previewRef.current;
    
    const previewScrollTop = previewElement.scrollTop;
    const previewScrollHeight = previewElement.scrollHeight - previewElement.clientHeight;
    const editorScrollHeight = editorElement.scrollHeight - editorElement.clientHeight;
    
    if (previewScrollHeight > 0 && editorScrollHeight > 0) {
      const scrollRatio = previewScrollTop / previewScrollHeight;
      const targetScrollTop = scrollRatio * editorScrollHeight;
      
      editorElement.scrollTop = targetScrollTop;
    }
    
    // 同期フラグをリセット（次のフレームで）
    requestAnimationFrame(() => {
      isSyncingRef.current = false;
    });
  }, []);

  return {
    editorRef,
    previewRef,
    syncScrollFromEditor,
    syncScrollFromPreview,
  };
};

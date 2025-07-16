import { useEffect, useState } from 'react';

/**
 * カスタムフック: 値をデバウンスする
 * @param value - デバウンスする値
 * @param delay - デバウンスの遅延時間（ミリ秒）
 * @returns デバウンスされた値
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // タイマーを設定して、delay後に値を更新
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // クリーンアップ関数: コンポーネントのアンマウント時やvalueが変更された時にタイマーをクリア
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
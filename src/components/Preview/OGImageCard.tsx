import React, { useState, useEffect } from 'react';
import type { OGImageData } from '../../services/ogImageService';
import { ogImageService } from '../../services/ogImageService';

interface OGImageCardProps {
  url: string;
  linkText?: string;
  className?: string;
}

export const OGImageCard: React.FC<OGImageCardProps> = ({
  url,
  linkText,
  className = '',
}) => {
  const [ogData, setOgData] = useState<OGImageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchOGData = async () => {
      setLoading(true);
      setError(null);
      setImageError(false);

      try {
        const result = await ogImageService.fetchOGImage(url);
        
        if (isMounted) {
          if (result.success && result.data) {
            setOgData(result.data);
          } else {
            setError(result.error || 'OG画像の取得に失敗しました');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('ネットワークエラーが発生しました');
          console.error('OG image fetch error:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOGData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  // ローディング状態
  if (loading) {
    return (
      <div className={`og-image-card ${className}`}>
        <div className="border border-vscode rounded-lg p-3 bg-vscode-secondary">
          <div className="flex items-center space-x-2 text-vscode-secondary text-sm">
            <div className="animate-spin h-4 w-4 border-2 border-vscode-accent border-t-transparent rounded-full"></div>
            <span>OG画像を読み込み中...</span>
          </div>
        </div>
      </div>
    );
  }

  // エラー状態、またはOG画像データがない場合は通常のリンクとして表示
  if (error || !ogData || !ogData.url || imageError) {
    return (
      <div className={`og-image-card ${className}`}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline inline-flex items-center space-x-1"
        >
          <span>{linkText || url}</span>
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    );
  }

  // OG画像カード表示
  return (
    <div className={`og-image-card ${className}`}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block border border-vscode rounded-lg overflow-hidden bg-vscode-secondary hover:bg-vscode-tertiary transition-colors duration-200 no-underline"
      >
        {/* OG画像 */}
        {ogData.url && !imageError && (
          <div className="aspect-video bg-vscode-tertiary relative overflow-hidden">
            <img
              src={ogData.url}
              alt={ogData.title || linkText || 'OG画像'}
              className="w-full h-full object-cover"
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          </div>
        )}

        {/* コンテンツ */}
        <div className="p-3">
          {/* タイトル */}
          {ogData.title && (
            <h4 className="text-vscode-primary font-medium text-sm line-clamp-2 mb-1">
              {ogData.title}
            </h4>
          )}

          {/* 説明 */}
          {ogData.description && (
            <p className="text-vscode-secondary text-xs line-clamp-2 mb-2">
              {ogData.description}
            </p>
          )}

          {/* サイト名とURL */}
          <div className="flex items-center justify-between text-xs text-vscode-secondary">
            {ogData.siteName && (
              <span className="font-medium">{ogData.siteName}</span>
            )}
            <span className="flex items-center space-x-1">
              <span className="truncate max-w-32">{new URL(url).hostname}</span>
              <svg
                className="w-3 h-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};

// line-clamp用のCSS（Tailwind CSS v3.4+で利用可能）
// 下位互換性のためのスタイル
const styles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .aspect-video {
    aspect-ratio: 16 / 9;
  }
`;

// スタイルを動的に追加
if (typeof document !== 'undefined' && !document.getElementById('og-image-card-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'og-image-card-styles';
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}
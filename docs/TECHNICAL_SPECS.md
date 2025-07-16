# ブログエディター - 技術仕様書

## プロジェクト概要
LexicalとReactを使った高機能なMarkdownブログエディター

## 技術スタック決定事項

### エディター関連
| 用途 | 採用技術 | 決定日 | 理由 |
|------|----------|--------|------|
| メインエディター | Lexical | プロジェクト開始時 | 高い拡張性とReact統合 |
| CSS編集エディター | Monaco Editor | 2025-07-16 | 優秀なCSS対応、TypeScript親和性 |

### フレームワーク・ライブラリ
| 種類 | 使用技術 | バージョン | 用途 |
|------|----------|------------|------|
| フレームワーク | React + Vite | ^18.0.0 | UIフレームワーク |
| 言語 | TypeScript | ^5.0.0 | 型安全性 |
| スタイリング | Tailwind CSS | ^3.0.0 | ユーティリティファースト |
| Markdown変換 | unified ecosystem | latest | remark/rehype |

### 未決定項目
- [ ] デフォルトCSSテンプレートの内容
- [ ] レイアウト画面分割の比率
- [ ] レスポンシブ対応の詳細仕様

## 実装方針

### パフォーマンス
- debounced rendering for リアルタイムプレビュー
- lazy loading for 重いコンポーネント
- code splitting for 各エディター

### データ管理
- Markdownを Single Source of Truth として管理
- localStorage for 自動保存
- React Context for グローバル状態

### アクセシビリティ
- WAI-ARIA対応
- キーボードナビゲーション
- スクリーンリーダー対応

## 参考資料
- [ADR記録](./adr/)
- [GitHub Issues](https://github.com/mishio-n/editor/issues)

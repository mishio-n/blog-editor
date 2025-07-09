# プロジェクトの全体像

とセットアップ

LexicalとReactを使った、高機能なMarkdownブログエディターを開発します。

## プロジェクトの要件

- ブラウザで動作する。
- WYSIWYGモードと、シンタックスハイライト付きプレーンテキストモードを切り替えられる。
- Markdownを「真の状態（Single Source of Truth）」として管理する。
- リアルタイムでHTMLプレビューが表示され、そのHTMLをコピーできる。
- プレビューのスタイルは、ユーザーが入力したCSSでカスタマイズできる。

## 技術スタック
| 種類             | 使用技術                                                                                   |
|------------------|--------------------------------------------------------------------------------------------|
| フレームワーク   | React (with Vite)                                                                          |
| 言語             | TypeScript                                                                                 |
| エディター       | Lexical (lexical, @lexical/react, @lexical/plain-text, @lexical/rich-text, @lexical/markdown, @lexical/code) |
| Markdown変換     | unified, remark, remark-rehype, rehype-stringify, remark-gfm, react-markdown                               |
| UI               | Tailwind CSS                                                                               |

まずはプロジェクトのファイル構造を考え、必要なコンポーネントの雛形を作成します。以下のファイルを作成してください。

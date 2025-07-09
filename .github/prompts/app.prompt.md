---
description: src/App.tsxについての指示書
---

このコンポーネントはアプリケーション全体の状態管理とレイアウトを担当します。

- markdown という string 型の state を持ち、初期値として簡単なMarkdownテキスト（見出しとリストなど）を設定してください。
- mode という 'wysiwyg' | 'plaintext' 型の state を持ち、初期値は 'plaintext' としてください。
- editorCss という string 型の state を持ち、初期値としてh1とpタグ用の簡単なCSSを設定してください。
- 画面は大きく3つのエリアに分かれるレイアウトにします。
  - 左側: エディターエリア
  - 右側: プレビューエリア
  - 下部: 設定・出力エリア
- エディターエリアには、mode の値に応じて WysiwygEditor コンポーネントか PlainTextEditor コンポーネントを条件付きで表示してください（コンポーネントは後で作成します）。
- mode を切り替えるためのボタンを配置してください。
- プレビューエリアには Preview コンポーネントを表示してください。
- 設定・出力エリアには Settings コンポーネントを表示してください。
- 各コンポーネントに必要な props（markdown, setMarkdown, editorCss, setEditorCssなど）を渡してください。
- 全体のスタイリングのため、簡単なCSSも記述してください（例: display: grid や flex を使ったレイアウト）。

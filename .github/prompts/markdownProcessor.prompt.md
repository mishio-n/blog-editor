---
description: src/utils/markdownProcessor.ts の指示書
---

Markdown文字列をHTML文字列に変換するための非同期関数を作成します。

## 要件

- unified, remark, remark-rehype, rehype-stringify, remark-gfm を使います。
- processMarkdown という名前の非同期関数をエクスポートしてください。
- この関数は引数として markdown: string を受け取ります。
- 内部で unified() のパイプラインを構築し、Markdownをパース(remark-parse)、GFMを適用(remark-gfm)、rehypeに変換(remark-rehype)、HTMLに変換(rehype-stringify)してください。
- 変換後のHTML文字列を Promise<string> として返してください。
- エラーハンドリングのために try-catch ブロックを使用してください。

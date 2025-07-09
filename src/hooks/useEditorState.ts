import { useCallback, useState } from "react";
import type { EditorMode, EditorState } from "../types";

const DEFAULT_CSS = `/* カスタムCSS */
.prose {
  max-width: none;
  line-height: 1.6;
}

.prose h1 {
  color: #1f2937;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.prose h2 {
  color: #374151;
  margin-top: 2rem;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.prose pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.prose blockquote {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  margin-left: 0;
  font-style: italic;
  color: #6b7280;
}`;

const INITIAL_MARKDOWN = `# Markdown Blog Editor

これは **Lexical** と **React** を使った高機能なMarkdownブログエディターです。

## 主な機能

- ✅ **WYSIWYGモード** と **プレーンテキストモード** の切り替え
- ✅ リアルタイム **HTMLプレビュー**
- ✅ **カスタムCSS** によるスタイリング
- ✅ **GitHub Flavored Markdown** 対応
- ✅ **HTMLコピー** 機能

## 使用技術

### フロントエンド
- React + TypeScript
- Lexical (Meta製リッチテキストエディター)
- Tailwind CSS

### Markdown処理
- unified
- remark
- remark-gfm
- react-markdown

## コード例

\`\`\`javascript
function processMarkdown(markdown) {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
}
\`\`\`

## 表の例

| 機能 | 状態 | 説明 |
|------|------|------|
| エディター | ✅ | Lexicalベース |
| プレビュー | ✅ | react-markdown |
| CSS編集 | ✅ | カスタマイズ可能 |

> **注意**: これはデモ用の初期コンテンツです。自由に編集してお試しください！
`;

export const useEditorState = () => {
  const [editorState, setEditorState] = useState<EditorState>({
    markdown: INITIAL_MARKDOWN,
    html: "",
    mode: "plaintext",
    customCSS: DEFAULT_CSS,
  });

	const updateMarkdown = useCallback((markdown: string) => {
		setEditorState((prev) => ({
			...prev,
			markdown,
		}));
	}, []);

	const updateHtml = useCallback((html: string) => {
		setEditorState((prev) => ({
			...prev,
			html,
		}));
	}, []);

	const updateMode = useCallback((mode: EditorMode) => {
		setEditorState((prev) => ({
			...prev,
			mode,
		}));
	}, []);

	const updateCustomCSS = useCallback((customCSS: string) => {
		setEditorState((prev) => ({
			...prev,
			customCSS,
		}));
	}, []);

	return {
		editorState,
		updateMarkdown,
		updateHtml,
		updateMode,
		updateCustomCSS,
	};
};

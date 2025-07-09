import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

/**
 * Markdown文字列をHTML文字列に変換する非同期関数
 * @param markdown - 変換するMarkdown文字列
 * @returns Promise<string> - 変換後のHTML文字列
 */
export async function processMarkdown(markdown: string): Promise<string> {
	try {
		const processor = remark()
			.use(remarkGfm) // GitHub Flavored Markdownの機能を追加
			.use(remarkRehype) // remarkからrehypeに変換（MarkdownのASTからHTMLのASTへ）
			.use(rehypeStringify); // HTML ASTを文字列に変換

		const result = await processor.process(markdown);
		return String(result);
	} catch (error) {
		console.error("Markdown processing error:", error);
		throw new Error(
			`Failed to process markdown: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

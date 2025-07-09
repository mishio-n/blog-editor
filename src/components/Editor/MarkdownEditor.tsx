import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { $getRoot, type EditorState } from "lexical";
import type React from "react";
import { useEffect } from "react";
import type { EditorMode } from "../../types";
import { EditorToolbar } from "./EditorToolbar";
import { PlainMarkdownEditor } from "./PlainMarkdownEditor";

interface MarkdownEditorProps {
  mode: EditorMode;
  value?: string;
  onChange?: (markdown: string) => void;
  onScroll?: () => void;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
  settings?: {
    fontSize?: number;
    lineHeight?: number;
    wordWrap?: boolean;
    showLineNumbers?: boolean;
  };
}

// エディターの初期化と変更監視を行う内部コンポーネント
const EditorContent: React.FC<{
  mode: EditorMode;
  value: string;
  onChange?: (markdown: string) => void;
  onScroll?: () => void;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  placeholder: React.ReactElement;
  settings?: MarkdownEditorProps["settings"];
}> = ({
  mode,
  value,
  onChange,
  onScroll,
  scrollRef,
  placeholder,
  settings,
}) => {
  const [editor] = useLexicalComposerContext(); // 初期値の設定とモード切り替え対応
  useEffect(() => {
    if (editor) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();

        if (mode === "wysiwyg" && value) {
          // WYSIWYGモードの場合、MarkdownをLexicalノードに変換
          $convertFromMarkdownString(value, TRANSFORMERS);
        }
        // プレーンテキストモードの場合は、PlainMarkdownEditorが直接valueを使用
      });
    }
  }, [editor, mode, value]); // 全ての依存関係を含める

  // エディターの変更を監視
  const handleEditorChange = (editorState: EditorState) => {
    editorState.read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      onChange?.(markdown);
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* WYSIWYGモードの時のみツールバーを表示 */}
      {mode === "wysiwyg" && <EditorToolbar />}

      {mode === "wysiwyg" ? (
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex-1 overflow-auto"
        >
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="p-4 min-h-full outline-none resize-none text-vscode-primary bg-vscode-editor vscode-scrollbar vscode-selection" />
            }
            placeholder={placeholder}
            ErrorBoundary={() => (
              <div className="text-red-400">
                エディターでエラーが発生しました
              </div>
            )}
          />
          <HistoryPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin onChange={handleEditorChange} />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <PlainMarkdownEditor
            value={value}
            onChange={onChange}
            onScroll={onScroll}
            scrollRef={scrollRef}
            placeholder="Markdownで入力..."
            className="h-full"
            showLineNumbers={settings?.showLineNumbers}
            fontSize={settings?.fontSize}
            lineHeight={settings?.lineHeight}
            wordWrap={settings?.wordWrap}
          />
        </div>
      )}
    </div>
  );
};

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  mode,
  value = "",
  onChange,
  onScroll,
  scrollRef,
  className = "",
  settings,
}) => {
  const placeholder = (
    <div className="text-vscode-muted absolute top-0 left-0 pointer-events-none">
      {mode === "wysiwyg" ? "リッチテキストで入力..." : "Markdownで入力..."}
    </div>
  );

  return (
    <div
      className={`border border-vscode rounded-lg h-full flex flex-col bg-vscode-editor ${className}`}
    >
      <LexicalComposer
        initialConfig={{
          namespace: "MarkdownEditor",
          theme: {
            text: {
              color: "var(--vscode-text-primary)",
            },
            paragraph: "text-vscode-primary",
            heading: {
              h1: "text-vscode-primary text-2xl font-bold",
              h2: "text-vscode-primary text-xl font-bold",
              h3: "text-vscode-primary text-lg font-bold",
              h4: "text-vscode-primary text-base font-bold",
              h5: "text-vscode-primary text-sm font-bold",
              h6: "text-vscode-primary text-xs font-bold",
            },
            list: {
              ul: "text-vscode-primary",
              ol: "text-vscode-primary",
            },
            listitem: "text-vscode-primary",
            quote: "text-vscode-secondary border-l-4 border-vscode-accent pl-4",
            code: "bg-vscode-tertiary text-vscode-primary px-1 py-0.5 rounded text-sm font-mono",
            codeHighlight: {
              atrule: "text-purple-400",
              attr: "text-blue-400",
              boolean: "text-red-400",
              builtin: "text-yellow-400",
              cdata: "text-gray-400",
              char: "text-green-400",
              class: "text-yellow-400",
              "class-name": "text-yellow-400",
              comment: "text-gray-500",
              constant: "text-red-400",
              deleted: "text-red-400",
              doctype: "text-gray-400",
              entity: "text-red-400",
              function: "text-blue-400",
              important: "text-red-400",
              inserted: "text-green-400",
              keyword: "text-purple-400",
              namespace: "text-red-400",
              number: "text-green-400",
              operator: "text-gray-300",
              prolog: "text-gray-400",
              property: "text-blue-400",
              punctuation: "text-gray-300",
              regex: "text-yellow-400",
              selector: "text-red-400",
              string: "text-green-400",
              symbol: "text-red-400",
              tag: "text-red-400",
              url: "text-blue-400",
              variable: "text-blue-400",
            },
          },
          onError: (error: Error) => {
            console.error("Lexical Editor Error:", error);
          },
          nodes: [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            CodeNode,
            CodeHighlightNode,
            AutoLinkNode,
            LinkNode,
          ],
        }}
      >
        <div className="flex-1 overflow-hidden">
          <EditorContent
            mode={mode}
            value={value}
            onChange={onChange}
            onScroll={onScroll}
            scrollRef={scrollRef}
            placeholder={placeholder}
            settings={settings}
          />
        </div>
      </LexicalComposer>
    </div>
  );
};

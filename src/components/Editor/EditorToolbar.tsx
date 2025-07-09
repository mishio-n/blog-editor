import { $createCodeNode } from "@lexical/code";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createHeadingNode,
  $createQuoteNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import type React from "react";

interface EditorToolbarProps {
  className?: string;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  className = "",
}) => {
  const [editor] = useLexicalComposerContext();

  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  };

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  };

  const formatUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  };

  const formatCode = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
  };

  const formatHeading = (headingType: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingType));
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  const formatCodeBlock = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createCodeNode());
      }
    });
  };

  const formatBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const formatNumberList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  const undo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const redo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  return (
    <div
      className={`border-b bg-gray-50 p-3 flex items-center space-x-2 flex-wrap ${className}`}
    >
      {/* 元に戻す・やり直し */}
      <div className="flex items-center space-x-1 border-r border-gray-300 pr-3 mr-1">
        <button
          type="button"
          onClick={undo}
          className="p-2 hover:bg-gray-200 rounded-md text-sm transition-colors"
          title="元に戻す (Ctrl+Z)"
        >
          ↶
        </button>
        <button
          type="button"
          onClick={redo}
          className="p-2 hover:bg-gray-200 rounded-md text-sm transition-colors"
          title="やり直し (Ctrl+Y)"
        >
          ↷
        </button>
      </div>

      {/* 見出し */}
      <div className="flex items-center space-x-1 border-r border-gray-300 pr-3 mr-1">
        <button
          type="button"
          onClick={() => formatHeading("h1")}
          className="px-3 py-1 hover:bg-blue-100 hover:text-blue-700 rounded-md text-sm font-bold transition-colors"
          title="見出し1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => formatHeading("h2")}
          className="px-3 py-1 hover:bg-blue-100 hover:text-blue-700 rounded-md text-sm font-bold transition-colors"
          title="見出し2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => formatHeading("h3")}
          className="px-3 py-1 hover:bg-blue-100 hover:text-blue-700 rounded-md text-sm font-bold transition-colors"
          title="見出し3"
        >
          H3
        </button>
      </div>

      {/* テキスト装飾 */}
      <div className="flex items-center space-x-1 border-r border-gray-300 pr-3 mr-1">
        <button
          type="button"
          onClick={formatBold}
          className="px-3 py-1 hover:bg-blue-100 hover:text-blue-700 rounded-md text-sm font-bold transition-colors"
          title="太字 (Ctrl+B)"
        >
          B
        </button>
        <button
          type="button"
          onClick={formatItalic}
          className="px-3 py-1 hover:bg-blue-100 hover:text-blue-700 rounded-md text-sm italic transition-colors"
          title="イタリック (Ctrl+I)"
        >
          I
        </button>
        <button
          type="button"
          onClick={formatUnderline}
          className="px-3 py-1 hover:bg-blue-100 hover:text-blue-700 rounded-md text-sm underline transition-colors"
          title="下線 (Ctrl+U)"
        >
          U
        </button>
        <button
          type="button"
          onClick={formatCode}
          className="px-3 py-1 hover:bg-blue-100 hover:text-blue-700 rounded-md text-sm font-mono bg-gray-100 transition-colors"
          title="インラインコード"
        >
          &lt;/&gt;
        </button>
      </div>

      {/* リスト */}
      <div className="flex items-center space-x-1 border-r border-gray-300 pr-3 mr-1">
        <button
          type="button"
          onClick={formatBulletList}
          className="px-3 py-1 hover:bg-blue-100 hover:text-blue-700 rounded-md text-sm transition-colors"
          title="箇条書きリスト"
        >
          • リスト
        </button>
        <button
          type="button"
          onClick={formatNumberList}
          className="px-3 py-1 hover:bg-blue-100 hover:text-blue-700 rounded-md text-sm transition-colors"
          title="番号付きリスト"
        >
          1. リスト
        </button>
      </div>

      {/* その他 */}
      <div className="flex items-center space-x-1">
        <button
          type="button"
          onClick={formatQuote}
          className="px-3 py-1 hover:bg-blue-100 hover:text-blue-700 rounded-md text-sm transition-colors"
          title="引用"
        >
          " 引用
        </button>
        <button
          type="button"
          onClick={formatCodeBlock}
          className="px-3 py-1 hover:bg-blue-100 hover:text-blue-700 rounded-md text-sm font-mono bg-gray-100 transition-colors"
          title="コードブロック"
        >
          {} コード
        </button>
      </div>
    </div>
  );
};

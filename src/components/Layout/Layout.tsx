import type React from "react";

interface LayoutProps {
  toolbar: React.ReactNode;
  editor: React.ReactNode;
  preview: React.ReactNode;
  cssEditor: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  toolbar,
  editor,
  preview,
  cssEditor,
}) => {
  return (
    <div className="h-screen flex flex-col bg-vscode-primary text-vscode-primary">
      {/* ツールバー */}
      <div className="flex-shrink-0">{toolbar}</div>

      {/* メインコンテンツエリア */}
      <div className="flex-1 flex overflow-hidden">
        {/* エディターエリア */}
        <div className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden bg-vscode-editor">
          <div className="flex-1 overflow-hidden">{editor}</div>
          <div className="flex-shrink-0">{cssEditor}</div>
        </div>

        {/* プレビューエリア */}
        <div className="flex-1 p-4 overflow-hidden bg-vscode-primary">
          {preview}
        </div>
      </div>
    </div>
  );
};

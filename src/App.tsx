import { useCallback, useState } from "react";
import { DocumentStats } from "./components/DocumentStats/DocumentStats";
import { CSSEditor } from "./components/Editor/CSSEditor";
import { MarkdownEditor } from "./components/Editor/MarkdownEditor";
import { Layout } from "./components/Layout/Layout";
import { HtmlPreview } from "./components/Preview/HtmlPreview";
import { SettingsPanel } from "./components/Settings/SettingsPanel";
import { Toolbar } from "./components/Toolbar/Toolbar";
import { useAutoSave } from "./hooks/useAutoSave";
import { useEditorState } from "./hooks/useEditorState";
import { useScrollSync } from "./hooks/useScrollSync";

function App() {
  const { editorState, updateMode, updateCustomCSS, updateMarkdown } =
    useEditorState();

  const { editorRef, previewRef, syncScrollFromEditor, syncScrollFromPreview } =
    useScrollSync();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<{
    name: string;
    isModified: boolean;
  } | null>(null);
  const [settings, setSettings] = useState({
    theme: "light" as "light" | "dark",
    fontSize: 14,
    lineHeight: 1.6,
    wordWrap: true,
    showLineNumbers: false,
    autoSave: false,
    syntaxHighlight: true,
  });

  const handleFileLoad = (content: string, filename?: string) => {
    updateMarkdown(content);
    setCurrentFile({
      name: filename || "Untitled.md",
      isModified: false,
    });
    console.log(`Loaded file: ${filename || "Unknown"}`);
  };

  const handleSave = useCallback(() => {
    const filename = currentFile?.name || "document.md";
    const blob = new Blob([editorState.markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // 保存後はmodifiedフラグをリセット
    if (currentFile) {
      setCurrentFile((prev) => (prev ? { ...prev, isModified: false } : null));
    }

    console.log(`Auto-saved: ${filename}`);
  }, [editorState.markdown, currentFile]);

  // Markdownの変更を監視してmodifiedフラグを更新
  const handleMarkdownChange = useCallback(
    (markdown: string) => {
      updateMarkdown(markdown);
      if (currentFile && !currentFile.isModified) {
        setCurrentFile((prev) => (prev ? { ...prev, isModified: true } : null));
      }
    },
    [updateMarkdown, currentFile]
  );

  // 自動保存機能
  const autoSaveStatus = useAutoSave(editorState.markdown, {
    enabled: settings.autoSave,
    delay: 3000, // 3秒後に自動保存
    onSave: handleSave,
  });

  const handleExportHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Document</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        ${editorState.customCSS}
    </style>
</head>
<body>
    ${editorState.html}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Layout
        toolbar={
          <Toolbar
            mode={editorState.mode}
            onModeChange={updateMode}
            onFileLoad={handleFileLoad}
            onSave={handleSave}
            onExportHtml={handleExportHtml}
            onOpenSettings={() => setIsSettingsOpen(true)}
            currentFile={currentFile}
            autoSaveStatus={autoSaveStatus}
          />
        }
        editor={
          <MarkdownEditor
            mode={editorState.mode}
            value={editorState.markdown}
            onChange={handleMarkdownChange}
            onScroll={syncScrollFromEditor}
            scrollRef={editorRef}
            className="h-full"
            settings={{
              fontSize: settings.fontSize,
              lineHeight: settings.lineHeight,
              wordWrap: settings.wordWrap,
              showLineNumbers: settings.showLineNumbers,
            }}
          />
        }
        preview={
          <div className="h-full flex flex-col">
            <HtmlPreview
              markdown={editorState.markdown}
              customCSS={editorState.customCSS}
              onScroll={syncScrollFromPreview}
              scrollRef={previewRef}
              className="flex-1"
            />
            <div className="border-t border-vscode p-3 bg-vscode-secondary">
              <DocumentStats markdown={editorState.markdown} />
            </div>
          </div>
        }
        cssEditor={
          <CSSEditor value={editorState.customCSS} onChange={updateCustomCSS} />
        }
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </>
  );
}

export default App;

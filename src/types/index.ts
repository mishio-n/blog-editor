// エディターのモード
export type EditorMode = 'wysiwyg' | 'plaintext';

// エディターの状態
export interface EditorState {
  markdown: string;
  html: string;
  mode: EditorMode;
  customCSS: string;
}

// エディター設定
export interface EditorConfig {
  showLineNumbers: boolean;
  enableSyntaxHighlight: boolean;
  theme: 'light' | 'dark';
}

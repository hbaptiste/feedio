import React from "react";
import { EditorState } from "prosemirror-state";

export interface ContentEditorProps {
  onUpdate: (editorState: EditorState) => void;
}
export declare const ContentEditor: React.FC<ContentEditorProps>;

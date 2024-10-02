import React from "react";
import { Editor } from "./editor";

export interface EditorContentProps extends React.HTMLProps<HTMLDivElement> {
  editor: Editor | null;
}

const EditorContent = ({ editor, ...rest }: EditorContentProps) => {
  return (
    <div
      ref={(ref) => {
        if (ref && editor) {
          ref.appendChild(editor.view.dom);
        }
      }}
      {...rest}
    />
  );
};

export default EditorContent;

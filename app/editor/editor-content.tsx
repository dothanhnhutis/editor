"use client";
import React from "react";
import { EditorState, Transaction, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Editor } from "./editor";
import { setBold, toggleBold } from "./custom-keymap";
type TEditorContent = ({}: {
  schema: any;
  plugins?: readonly Plugin<any>[] | undefined;
  onUpdate?: (props: { editor: Editor; transaction: Transaction }) => void;
}) => React.ReactNode;

const EditorContent: TEditorContent = ({ schema, onUpdate, plugins }) => {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const editorViewRef = React.useRef<EditorView | null>(null);

  React.useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      schema,
      plugins,
    });

    editorViewRef.current = new EditorView(editorRef.current, {
      state,
      dispatchTransaction(transaction) {
        const newState = editorViewRef.current!.state.apply(transaction);
        editorViewRef.current!.updateState(newState);
        if (onUpdate) {
          onUpdate({
            editor: new Editor(editorViewRef.current!),
            transaction,
          });
        }
      },
    });

    return () => {
      if (editorViewRef.current) {
        editorViewRef.current.destroy();
        editorViewRef.current = null;
      }
    };
  }, []);

  return (
    <div className="p-1">
      <div className="flex gap-2 justify-center">
        <button type="button" onClick={setBold}>
          bold
        </button>
      </div>
      <div ref={editorRef} className="[&>.ProseMirror]:outline-none" />
    </div>
  );
};

export default EditorContent;

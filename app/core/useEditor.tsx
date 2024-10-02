import React from "react";
import { Editor } from "./editor";
import { EditorState, Plugin, Transaction } from "prosemirror-state";
import { Schema } from "prosemirror-model";
import { EditorView } from "prosemirror-view";

interface UseEditorProps {
  schema: Schema;
  plugins?: readonly Plugin<any>[] | undefined;
  onUpdate?: (props: { editor: Editor; transaction: Transaction }) => void;
}

export const useEditor = (props: UseEditorProps) => {
  const { schema, plugins, onUpdate } = props;
  const [editor, setEditor] = React.useState<Editor | null>(null);

  React.useEffect(() => {
    function init() {
      const state = EditorState.create({
        schema,
        plugins,
      });
      const container = document.createElement("div");
      const view = new EditorView(container, {
        state,
        dispatchTransaction(transaction) {
          const newState = view.state.apply(transaction);
          view.updateState(newState);
          if (onUpdate) {
            onUpdate({
              editor: new Editor(view),
              transaction,
            });
          }
        },
      });
      setEditor(new Editor(view));
    }

    init();
  }, []);

  return editor;
};

"use client";
import { DOMSerializer, Schema, SchemaSpec } from "prosemirror-model";
import { EditorState, Transaction, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

import React from "react";
const schema = new Schema({
  nodes: {
    doc: {
      content: "block+",
    },
    paragraph: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p" }],
      toDOM: () => ["p", 0],
    },
    text: {
      group: "inline",
    },
  },
});

class Editor {
  view: EditorView;

  constructor(view: EditorView) {
    this.view = view;
  }

  getJSON() {
    return this.view.state.doc.toJSON();
  }

  getHTML() {
    const fragment = DOMSerializer.fromSchema(
      this.view.state.schema
    ).serializeFragment(this.view.state.doc.content);
    const temporaryDiv = document.createElement("div");
    temporaryDiv.appendChild(fragment);
    const htmlContent = temporaryDiv.innerHTML;
    return htmlContent;
  }

  getText() {
    return this.view.state.doc.textContent;
  }
}

type TUseEditor = ({}: {
  schema: any;
  plugins?: readonly Plugin<any>[] | undefined;
  onUpdate?: (props: { editor: Editor; transaction: Transaction }) => void;
}) => Editor | null;

const useEditor: TUseEditor = ({ schema, plugins = [], onUpdate }) => {
  // const editorRef = React.useRef<HTMLDivElement | null>(null);
  // const [editorInstance, setEditorInstance] = React.useState<Editor | null>(
  //   null
  // );

  // React.useEffect(() => {
  //   if (!editorRef.current) return;

  //   const state = EditorState.create({
  //     schema,
  //     plugins,
  //   });

  //   const view = new EditorView(editorRef.current, {
  //     state,
  //     dispatchTransaction(transaction) {
  //       const newState = view.state.apply(transaction);
  //       view.updateState(newState);
  //       if (onUpdate) {
  //         onUpdate({ editor: new Editor(view), transaction });
  //       }
  //     },
  //   });
  //   const editor = new Editor(view);
  //   setEditorInstance(editor);

  //   return () => {
  //     if (editorInstance) {
  //       editorInstance.view.destroy();
  //     }
  //   };
  // }, [schema, plugins, onUpdate]);

  // return editorInstance;

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
          onUpdate({ editor: new Editor(editorViewRef.current!), transaction });
        }
        // const boldMark = schema.marks.bold;
        // setIsBoldActive(isMarkActive(newState, boldMark));
      },
    });

    return () => {
      if (editorViewRef.current) {
        editorViewRef.current.destroy();
        editorViewRef.current = null;
      }
    };
  }, []);

  return editorViewRef.current ? new Editor(editorViewRef.current) : null;
};

interface EditorContentProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  editor: Editor | null;
}

const EditorContent: React.FC<EditorContentProps> = ({ editor, ...props }) => {
  const editorRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (editor && editorRef.current) {
      editorRef.current.appendChild(editor.view.dom);
    }

    return () => {
      if (editor && editorRef.current) {
        editorRef.current.removeChild(editor.view.dom);
      }
    };
  }, [editor]);

  return <div ref={editorRef} {...props} />;
};

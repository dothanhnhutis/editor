"use client";
import React from "react";
import { useEditor } from "./core/useEditor";
import EditorContent from "./core/editorContent";
import { schema } from "./core/custom-schema";
import { customKeymap } from "./core/custom-keymap";

export default function Home() {
  const editor = useEditor({
    schema,
    plugins: [customKeymap],
    onUpdate: ({ editor }) => {
      console.log({
        json: editor.getJSON(),
      });
    },
  });
  if (!editor) return <div>Loading...</div>;

  return (
    <EditorContent
      editor={editor}
      className="[&_.ProseMirror]:outline-none [&_.ProseMirror]:whitespace-pre-wrap"
    />
  );
}

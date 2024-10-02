"use client";
import React from "react";
import EditorContent from "./editor/editor-content";
import { schema } from "./editor/custom-schema";
import { customKeymap } from "./editor/custom-keymap";

export default function Home() {
  return <EditorContent schema={schema} plugins={[customKeymap]} />;
}

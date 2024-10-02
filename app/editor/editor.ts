import { DOMSerializer } from "prosemirror-model";
import { EditorView } from "prosemirror-view";

export class Editor {
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

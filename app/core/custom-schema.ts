import {
  DOMOutputSpec,
  MarkSpec,
  NodeSpec,
  ParseRule,
  Schema,
  StyleParseRule,
  TagParseRule,
} from "prosemirror-model";
import { Editor } from "./editor";

export type ParentConfig<T> = Partial<{
  [P in keyof T]: Required<T>[P] extends (...args: any) => any
    ? (...args: Parameters<Required<T>[P]>) => ReturnType<Required<T>[P]>
    : T[P];
}>;

export const schema = new Schema({
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
  marks: {
    bold: {
      toDOM() {
        return ["strong", 0];
      },
      parseDOM: [
        {
          tag: "strong",
        },
        {
          tag: "b",
          getAttrs: (node) =>
            (node as HTMLElement).style.fontWeight !== "normal" && null,
        },
        {
          style: "font-weight",
          getAttrs: (value) =>
            /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) && null,
        },
      ],
    },
  },
});

interface ExtensionOptions<Options = any, Storage = any> {
  name: string;
  priority?: number;
  defaultOptions?: Options;
  addOptions?: () => Options;
  parseHTML?: (this: {
    name: string;
    options: Options;
    storage: Storage;
    parent: ParentConfig<MarkConfig<Options, Storage>>["parseHTML"];
    editor?: Editor;
  }) => MarkSpec["parseDOM"];
  renderHTML?:
    | ((
        this: {
          name: string;
          options: Options;
          storage: any;
          parent: (() => readonly ParseRule[] | undefined) | undefined;
          editor?: Editor;
        },
        props: {
          node: Node;
          HTMLAttributes: Record<string, any>;
        }
      ) => DOMOutputSpec)
    | null
    | undefined;
}

class Mark<Options = any> {
  type: string = "mark";
  options: Partial<ExtensionOptions<Options>>;
  constructor(options: Partial<ExtensionOptions<Options>>) {
    this.options = options;
  }
  static create<O = any>(options: Partial<ExtensionOptions<O>>) {
    return new Mark(options);
  }
}
export interface BoldOptions {
  HTMLAttributes: Record<string, any>;
}
const Bold = Mark.create<BoldOptions>({
  name: "bold",
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  parseHTML() {
    return [
      {
        tag: "strong",
      },
      {
        tag: "b",
        getAttrs: (dom) => dom.style.fontWeight !== "normal" && null,
      },
      {
        style: "font-weight",
        getAttrs: (value) =>
          /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) && null,
      },
    ];
  },
  renderHTML({ HTMLAttributes, node }) {
    return [
      "strong",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addCommands() {
    return {
      setBold:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name);
        },
      toggleBold:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },
      unsetBold:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-b": () => this.editor.commands.toggleBold(),
      "Mod-B": () => this.editor.commands.toggleBold(),
    };
  },
});

import {
  deleteSelection,
  joinBackward,
  splitBlock,
  toggleMark,
} from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { MarkType } from "prosemirror-model";
import { Command } from "prosemirror-state";

const handleBackspace: Command = (state, dispatch) => {
  const { $cursor } = state.selection as any;
  if ($cursor && $cursor.parent.content.size === 0) {
    const tr = state.tr;
    const nodeBefore = $cursor.nodeBefore;
    if (nodeBefore) {
      tr.delete($cursor.pos - 1, $cursor.pos);
      if (dispatch) dispatch(tr);
      return true;
    }
  }
  return false;
};

const insertHardBreak: Command = (state, dispatch) => {
  const { $from, $to } = state.selection;
  if (dispatch) {
    dispatch(
      state.tr
        .replaceSelectionWith(state.schema.node("hard_break"))
        .scrollIntoView()
    );
  }
  return true;
};

export const toggleBold =
  (markType: MarkType): Command =>
  (state, dispatch) => {
    return toggleMark(markType)(state, dispatch);
  };

export const setBold = (): Command => (state, dispatch) => {
  const markType = state.schema.marks.bold;
  console.log("bold");
  if (!markType) {
    return toggleMark(markType)(state, dispatch);
  }
  return false;
};

const unSetBold =
  (markType: MarkType): Command =>
  (state, dispatch) => {
    const { from, to } = state.selection;
    const hasBold = state.doc.rangeHasMark(from, to, markType);
    if (!hasBold) {
      return toggleMark(markType)(state, dispatch);
    }
    return false;
  };

export const customKeymap = keymap({
  // Enter: (state, dispatch, view) => {
  //   return chainCommands(insertHardBreak, splitBlock)(state, dispatch, view);
  // },
  Enter: (state, dispatch) => {
    return splitBlock(state, dispatch);
  },
  Backspace: (state, dispatch, view) => {
    return (
      handleBackspace(state, dispatch) ||
      deleteSelection(state, dispatch) ||
      joinBackward(state, dispatch, view)
    );
  },
  "Mod-b": (state, dispatch) => {
    const markType = state.schema.marks.bold;
    return toggleBold(markType)(state, dispatch);
  },
});

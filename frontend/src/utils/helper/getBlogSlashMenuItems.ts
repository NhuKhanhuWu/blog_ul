/** @format */

import {
  BlockNoteEditor,
  getDefaultSlashMenuItems,
  insertOrUpdateBlock,
} from "@blocknote/core";
import { getDefaultReactSlashMenuItems } from "@blocknote/react";

export const getBlogSlashMenuItems = (editor: BlockNoteEditor) => {
  const items = getDefaultReactSlashMenuItems(editor);
  const supportedBlockTypes = new Set([
    "paragraph",
    "heading",
    "heading_2",
    "image",
  ]);
  const supportedTitles = new Set(
    getDefaultSlashMenuItems(editor)
      .filter((item) => supportedBlockTypes.has(item.key))
      .map((item) => item.title),
  );

  const customItems = [
    {
      title: "Quote",
      subtext: "A quoted passage",
      aliases: ["blockquote"],
      onItemClick: () =>
        insertOrUpdateBlock(editor, {
          type: "paragraph",
          props: { textColor: "blue" },
          content: [{ type: "text", text: "", styles: { italic: true } }],
        }),
    },
    {
      title: "Highlight",
      subtext: "Emphasized text",
      aliases: ["mark"],
      onItemClick: () =>
        insertOrUpdateBlock(editor, {
          type: "paragraph",
          props: { textColor: "yellow" },
          content: [
            {
              type: "text",
              text: "",
              styles: { italic: true, underline: true },
            },
          ],
        }),
    },
    {
      title: "Meta",
      subtext: "Muted supporting text",
      aliases: ["caption", "metadata"],
      onItemClick: () =>
        insertOrUpdateBlock(editor, {
          type: "paragraph",
          props: { textColor: "gray" },
        }),
    },
  ];

  return [
    ...items.filter((item) => supportedTitles.has(item.title)),
    ...customItems,
  ];
};

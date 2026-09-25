/** @format */
import { PartialBlock } from "@blocknote/core";
import { NormalizedContent } from "../types/blog.type";

export function convertToBlockNoteBlocks(
  content: NormalizedContent[],
): PartialBlock[] {
  return content.map((item): PartialBlock => {
    switch (item.type) {
      case "title":
        return {
          type: "heading",
          props: { level: 2 },
          content: item.text,
        } as PartialBlock;

      case "section":
        return {
          type: "heading",
          props: { level: 3 },
          content: item.text,
        } as PartialBlock;

      case "quote":
        return {
          type: "paragraph",
          props: {
            textColor: "blue", // Marker cho Quote
          },
          content: [
            {
              type: "text",
              text: `“ ${item.text} ”`,
              styles: { italic: true },
            },
          ],
        } as PartialBlock;

      case "highlight":
        return {
          type: "paragraph",
          props: {
            textColor: "yellow", // Marker cho Highlight
          },
          content: [
            {
              type: "text",
              text: item.text,
              styles: { italic: true, underline: true },
            },
          ],
        } as PartialBlock;

      case "meta":
        return {
          type: "paragraph",
          props: {
            textColor: "gray", // Marker cho Meta
          },
          content: item.text,
        } as PartialBlock;

      case "image":
        return {
          type: "image",
          props: {
            url: item.img,
            caption: item.note || "",
            previewWidth: 650,
          },
        } as PartialBlock;

      default:
        return {
          type: "paragraph",
          content: item.text,
        } as PartialBlock;
    }
  });
}

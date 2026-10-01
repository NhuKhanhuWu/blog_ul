/** @format */

import type { Block } from "@blocknote/core";
import { ContentBlock } from "../../types/blog.type";

export interface ImageMetadata {
  url: string;
  isEmbed: boolean;
}

function getBlockText(block: Block): string {
  if (!Array.isArray(block.content)) {
    return "";
  }

  return block.content
    .map((item) => {
      if ("text" in item) {
        return item.text;
      }

      return "";
    })
    .join("");
}

export function convertBlockNoteToBlogContent(
  blocks: Block[],
  imageMetadata: Map<string, ImageMetadata>,
): ContentBlock[] {
  return blocks
    .map((block): ContentBlock | null => {
      /* =========================
         Image
         ========================= */
      if (block.type === "image") {
        const url = block.props.url;

        if (!url) {
          return null;
        }

        const metadata = imageMetadata.get(block.id);

        return {
          type: "image",
          img: url,
          note: block.props.caption || undefined,

          // Nếu metadata tồn tại thì dùng nó.
          // Fallback true = external/embed image.
          isEmbed: metadata?.isEmbed ?? true,
        };
      }

      const text = getBlockText(block);

      // Không lưu empty paragraph
      if (!text.trim()) {
        return null;
      }

      /* =========================
         Heading 2 -> title
         ========================= */
      if (block.type === "heading" && block.props.level === 1) {
        return {
          type: "title",
          text,
        };
      }

      /* =========================
         Heading 3 -> section
         ========================= */
      if (block.type === "heading" && block.props.level === 2) {
        return {
          type: "section",
          text,
        };
      }

      /* =========================
         Paragraph styles
         ========================= */

      if (block.type === "paragraph") {
        const textColor = block.props.textColor;

        if (textColor === "blue") {
          return {
            type: "quote",
            text,
          };
        }

        if (textColor === "yellow") {
          return {
            type: "highlight",
            text,
          };
        }

        if (textColor === "gray") {
          return {
            type: "meta",
            text,
          };
        }

        return {
          type: "paragraph",
          text,
        };
      }

      return {
        type: "paragraph",
        text,
      };
    })
    .filter((block): block is ContentBlock => block !== null);
}

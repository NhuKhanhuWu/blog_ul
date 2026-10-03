/** @format */

import type { Block } from "@blocknote/core";

export function countBlockCharacters(blocks: Block[]): number {
  return blocks.reduce((total, block) => {
    if (!Array.isArray(block.content)) {
      return total;
    }

    const blockLength = block.content.reduce((length, content) => {
      if ("text" in content) {
        return length + content.text.length;
      }

      return length;
    }, 0);

    return total + blockLength;
  }, 0);
}

/** @format */

import { BlockNoteEditor } from "@blocknote/core";
import type { ImageMetadata } from "./convertBlockNoteToBlogContent";
import { EditorImageCounts } from "../../component/blog/EditorFooter/EditorFooter";

export function reconcileImageMetadata(
  editor: BlockNoteEditor,
  metadata: Map<string, ImageMetadata>,
  pendingUploads: Map<string, number>,
): EditorImageCounts {
  const currentMetadata = new Map<string, ImageMetadata>();
  const counts = { embedded: 0, uploaded: 0 };

  for (const block of editor.document) {
    if (block.type !== "image") continue;

    const url = block.props.url;
    if (!url) continue;

    let imageMetadata = metadata.get(block.id);

    if (!imageMetadata || imageMetadata.url !== url) {
      const pendingCount = pendingUploads.get(url) ?? 0;
      const isUploaded = pendingCount > 0;

      if (isUploaded) {
        if (pendingCount === 1) pendingUploads.delete(url);
        else pendingUploads.set(url, pendingCount - 1);
      }

      imageMetadata = { url, isEmbed: !isUploaded };
    }

    currentMetadata.set(block.id, imageMetadata);
    if (imageMetadata.isEmbed) counts.embedded++;
    else counts.uploaded++;
  }

  metadata.clear();
  currentMetadata.forEach((value, key) => metadata.set(key, value));

  return counts;
}

/** @format */

import { useCallback, useRef, useState } from "react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";

import { uploadBlogImage } from "../../api/blog.api";
import { BlogDetailProps, ContentBlock } from "../../types/blog.type";
import { convertBlockNoteToBlogContent } from "../../utils/helper/convertBlockNoteToBlogContent";
import { reconcileImageMetadata } from "../../utils/helper/reconcileImageMetadata";

export interface ImageMetadata {
  url: string;
  isEmbed: boolean;
}

interface UseBlogEditorImagesProps {
  blog: BlogDetailProps;
  initialContent: PartialBlock[];
}

export function useBlogEditorImages({
  blog,
  initialContent,
}: UseBlogEditorImagesProps) {
  const [imageCounts, setImageCounts] = useState({
    embedded: 0,
    uploaded: 0,
  });
  const pendingUploads = useRef(new Map<string, number>());
  const imageMetadata = useRef<Map<string, ImageMetadata> | null>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      const url = await uploadBlogImage(blog._id, file);

      pendingUploads.current.set(
        url,
        (pendingUploads.current.get(url) ?? 0) + 1,
      );

      return url;
    },
    [blog._id],
  );

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent,
    uploadFile,
  });

  if (imageMetadata.current === null) {
    const sourceImages =
      blog.content?.filter(
        (block): block is Extract<ContentBlock, { type: "image" }> =>
          block.type === "image",
      ) ?? [];
    const editorImages = editor.document.filter(
      (block) => block.type === "image",
    );
    const metadata = new Map<string, ImageMetadata>();

    editorImages.forEach((block, index) => {
      const source = sourceImages[index];
      const url = block.props.url;

      if (!source || !url) return;

      metadata.set(block.id, { url, isEmbed: source.isEmbed });
    });

    imageMetadata.current = metadata;
  }

  const reconcileImages = useCallback(() => {
    const counts = reconcileImageMetadata(
      editor,
      imageMetadata.current!,
      pendingUploads.current,
    );

    setImageCounts(counts);
  }, [editor]);

  const getContent = useCallback(() => {
    reconcileImages();

    return convertBlockNoteToBlogContent(
      editor.document,
      imageMetadata.current!,
    );
  }, [editor, reconcileImages]);

  return { editor, imageCounts, getContent };
}

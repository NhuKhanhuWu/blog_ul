/** @format */

import { useCallback, useRef, useState } from "react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlogDetailProps, ContentBlock } from "../../types/blog.type";
import { uploadBlogImage } from "../../api/blog.api";
import { reconcileImageMetadata } from "../../utils/helper/reconcileImageMetadata";
import { convertBlockNoteToBlogContent } from "../../utils/helper/convertBlockNoteToBlogContent";

export interface ImageMetadata {
  url: string;
  isEmbed: boolean;
}

interface UseBlogEditorProps {
  blog: BlogDetailProps;
  initialContent: PartialBlock[];
  setSaved: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useBlogEditor({
  blog,
  initialContent,
  setSaved,
}: UseBlogEditorProps) {
  const [title, setTitle] = useState(blog.title || "");
  const [imageCounts, setImageCounts] = useState(() => ({
    embedded: 0,
    uploaded: 0,
  }));

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

  // Initialize image metadata once
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

      metadata.set(block.id, {
        url,
        isEmbed: source.isEmbed,
      });
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

    return counts;
  }, [editor]);

  const handleEditorChange = useCallback(() => {
    setSaved(false);
    reconcileImages();
  }, [reconcileImages, setSaved]);

  const handleTitleChange = useCallback(
    (value: string) => {
      setTitle(value);
      setSaved(false);
    },
    [setSaved],
  );

  const getContent = useCallback(() => {
    reconcileImages();

    return convertBlockNoteToBlogContent(
      editor.document,
      imageMetadata.current!,
    );
  }, [editor, reconcileImages]);

  const saveDraft = useCallback(async () => {
    const content = getContent();

    console.log("title:", title);
    console.log("content:", content);

    // TODO: handle save draft
    // await updateBlog(blog._id, {
    //   title,
    //   content,
    // });

    setSaved(true);
  }, [blog._id, getContent, title, setSaved]);

  return {
    editor,
    title,
    setTitle: handleTitleChange,
    imageCounts,
    handleEditorChange,
    saveDraft,
    getContent,
  };
}

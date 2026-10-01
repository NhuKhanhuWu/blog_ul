/** @format */

import { useMemo, useState } from "react";
import { PartialBlock } from "@blocknote/core";

import { BlogDetailProps } from "../../../types/blog.type";
import { useAppSelector } from "../../../hook/shared/reduxHooks";
import { convertToBlockNoteBlocks } from "../../../utils/helper/convertToBlockNoteSchema";

import BlogEditorContent from "../BlogEditorContent/BlogEditorContent";

interface BlogEditorProps {
  blog: BlogDetailProps;
}

const defaultContent: PartialBlock[] = [
  {
    type: "paragraph",
    content: "",
  },
];

function BlogEditor({ blog }: BlogEditorProps) {
  const theme = useAppSelector((state) => state.theme.theme);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [saved, setSaved] = useState(true);

  const initialContent = useMemo<PartialBlock[]>(() => {
    const blocks = convertToBlockNoteBlocks(blog.content || []);

    return blocks.length > 0 ? blocks : defaultContent;
  }, [blog.content]);

  return (
    <BlogEditorContent
      key={blog._id}
      blog={blog}
      initialContent={initialContent}
      theme={theme}
      previewOpen={previewOpen}
      setPreviewOpen={setPreviewOpen}
      saved={saved}
      setSaved={setSaved}
    />
  );
}

export default BlogEditor;

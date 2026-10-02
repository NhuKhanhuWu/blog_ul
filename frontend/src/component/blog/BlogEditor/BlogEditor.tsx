/** @format */

import { useState } from "react";

import { BlogDetailProps } from "../../../types/blog.type";
import { useAppSelector } from "../../../hook/shared/reduxHooks";

import BlogEditorContent from "../BlogEditorContent/BlogEditorContent";
import { BlogEditorProvider } from "../../../context/BlogEditorContext";

interface BlogEditorProps {
  blog: BlogDetailProps;
}

function BlogEditor({ blog }: BlogEditorProps) {
  const theme = useAppSelector((state) => state.theme.theme);

  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <BlogEditorProvider key={blog._id} blog={blog}>
      <BlogEditorContent
        theme={theme}
        previewOpen={previewOpen}
        setPreviewOpen={setPreviewOpen}
      />
    </BlogEditorProvider>
  );
}

export default BlogEditor;

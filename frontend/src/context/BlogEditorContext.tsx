/** @format */

import { createContext, useContext, useMemo, type ReactNode } from "react";

import { PartialBlock } from "@blocknote/core";

import { BlogDetailProps } from "../types/blog.type";
import { useBlogEditor } from "../hook/blog/useBlogEditor";

import { convertToBlockNoteBlocks } from "../utils/helper/convertToBlockNoteBlocks";

interface BlogEditorProviderProps {
  blog: BlogDetailProps;
  children: ReactNode;
}

type BlogEditorContextValue = ReturnType<typeof useBlogEditor>;

const BlogEditorContext = createContext<BlogEditorContextValue | null>(null);

export function BlogEditorProvider({
  blog,
  children,
}: BlogEditorProviderProps) {
  const initialContent = useMemo<PartialBlock[]>(() => {
    const blocks = convertToBlockNoteBlocks(blog.content || []);

    return blocks.length > 0 ? blocks : [{ type: "paragraph", content: "" }];
  }, [blog.content]);

  const editorState = useBlogEditor({
    blog,
    initialContent,
  });

  const value = useMemo(() => editorState, [editorState]);

  return (
    <BlogEditorContext.Provider value={value}>
      {children}
    </BlogEditorContext.Provider>
  );
}

export function useBlogEditorContext() {
  const context = useContext(BlogEditorContext);

  if (!context) {
    throw new Error(
      "useBlogEditorContext must be used inside BlogEditorProvider",
    );
  }

  return context;
}

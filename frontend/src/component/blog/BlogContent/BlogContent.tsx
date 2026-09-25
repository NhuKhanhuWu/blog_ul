/** @format */

import { useMemo } from "react";
import { NormalizedBlog } from "../../../types/blog.type";
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useAppSelector } from "../../../hook/shared/reduxHooks";
import { convertToBlockNoteBlocks } from "../../../utils/convertToBlockNoteSchema";
import styles from "./BlogContent.module.scss";

interface BlogContentProps {
  blog: NormalizedBlog;
}

export function BlogContent({ blog }: BlogContentProps) {
  // 1. Convert blog content to BlockNote format.
  const initialContent = useMemo(() => {
    return convertToBlockNoteBlocks(blog.content);
  }, [blog.content]);

  // 2. Initialize a BlockNote instance.
  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent,
  });

  // get theme
  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <div className={styles.blogContentWrapper}>
      <BlockNoteView editor={editor} editable={false} theme={theme} />
    </div>
  );
}

export default BlogContent;

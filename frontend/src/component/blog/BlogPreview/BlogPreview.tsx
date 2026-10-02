/** @format */

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import styles from "./BlogPreview.module.scss";
import stylesBlogContent from "../BlogContent/BlogContent.module.scss";
import { IoClose } from "react-icons/io5";

interface BlogPreviewProps {
  title: string;
  editor: BlockNoteEditor;
  theme: "light" | "dark";
  onClose: () => void;
}

function BlogPreview({ title, editor, theme, onClose }: BlogPreviewProps) {
  return (
    <BlogPreviewContent
      title={title}
      blocks={editor.document}
      theme={theme}
      onClose={onClose}
    />
  );
}

function BlogPreviewContent({
  title,
  blocks,
  theme,
  onClose,
}: {
  title: string;
  blocks: PartialBlock[];
  theme: "light" | "dark";
  onClose: () => void;
}) {
  const previewEditor = useCreateBlockNote({
    initialContent: blocks,
  });

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <div>
            <h2>Blog Preview</h2>
          </div>

          <button type="button" className={styles.close} onClick={onClose}>
            <IoClose />
          </button>
        </header>

        <div
          className={`${stylesBlogContent.blogContentWrapper} ${styles.content}`}>
          <article>
            <h1>{title || "Untitled blog"}</h1>

            <BlockNoteView
              editor={previewEditor}
              editable={false}
              theme={theme}
            />
          </article>
        </div>

        {/* <footer className={styles.footer}>
          <button type="button" onClick={onClose}>
            Back to editor
          </button>
        </footer> */}
      </div>
    </div>
  );
}

export default BlogPreview;

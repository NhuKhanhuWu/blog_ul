/** @format */

import { FaRegEye, FaRegSave } from "react-icons/fa";
import { LuSend } from "react-icons/lu";

import styles from "./BlogEditorContent.module.scss";

interface BlogEditorHeaderProps {
  saved: boolean;
  onPreview: () => void;
  onSave: () => void;
  onPublish: () => void;
}

function BlogEditorHeader({
  saved,
  onPreview,
  onSave,
  onPublish,
}: BlogEditorHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerTitle}>
        <span>Write a Blog</span>

        <span
          className={`${styles.status} ${
            saved ? styles.saved : styles.unsaved
          }`}>
          {saved ? "✓ Saved" : "● Unsaved"}
        </span>
      </div>

      <div className={styles.actions}>
        <button type="button" className="btn-secondary" onClick={onPreview}>
          <FaRegEye />
          Preview
        </button>

        <button type="button" className="btn-secondary" onClick={onSave}>
          <FaRegSave />
          Save Draft
        </button>

        <button type="button" className="btn-primary" onClick={onPublish}>
          <LuSend />
          Publish
        </button>
      </div>
    </header>
  );
}

export default BlogEditorHeader;

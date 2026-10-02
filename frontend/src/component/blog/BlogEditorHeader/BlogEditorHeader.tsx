/** @format */

import { FaRegEye, FaRegSave } from "react-icons/fa";
import { LuSend } from "react-icons/lu";

import styles from "./BlogEditorHeader.module.scss";
import { useBlogEditorContext } from "../../../context/BlogEditorContext";

interface BlogEditorHeaderProps {
  onPreview: () => void;
}

const saveStatusConfig = {
  saved: {
    className: styles.saved,
    text: "✓ Saved",
  },
  unsaved: {
    className: styles.unsaved,
    text: "● Unsaved",
  },
  saving: {
    className: styles.saving,
    text: "◌ Saving...",
  },
  error: {
    className: styles.saveError,
    text: "● Save failed",
  },
};

function BlogEditorHeader({ onPreview }: BlogEditorHeaderProps) {
  const { saveStatus, saveDraft } = useBlogEditorContext();
  const status = saveStatusConfig[saveStatus];

  // TODO: handle save draft logic and publish here

  return (
    <header className={styles.header}>
      <div className={styles.titleAndAction}>
        <div className={styles.headerTitle}>
          <span>Write a Blog</span>

          <span className={`${styles.status} ${status.className}`}>
            {status.text}
          </span>
        </div>

        <div className={styles.actions}>
          <button type="button" className="btn-secondary" onClick={onPreview}>
            <FaRegEye />
            Preview
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={saveDraft}
            disabled={saveStatus === "saving"}>
            <FaRegSave />
            Save Draft
          </button>

          <button type="button" className="btn-primary">
            <LuSend />
            Publish
          </button>
        </div>
      </div>

      <p className={`highlight-txt ${styles.notice}`}>
        This blog will be hidden from search results until you publish it again.
      </p>
    </header>
  );
}

export default BlogEditorHeader;

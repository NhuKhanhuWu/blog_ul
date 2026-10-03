/** @format */

import { FaRegEye, FaRegSave } from "react-icons/fa";
import { LuSend } from "react-icons/lu";

import styles from "./BlogEditorHeader.module.scss";
import { useBlogEditorContext } from "../../../context/BlogEditorContext";
import { Dispatch, SetStateAction, useState } from "react";
import ModalOverlay from "../../ui/Modal/Modal";
import useBlogPublish from "../../../hook/blog/useBlogPublish";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

interface BlogEditorHeaderProps {
  onPreview: () => void;
}

interface PublishModalProps {
  isOpenModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

interface ActionBtnsProps {
  onPreview: () => void;
  saveDraft: () => void;
  saveStatus: "saved" | "unsaved" | "saving" | "error";
  setOpenModal: Dispatch<SetStateAction<boolean>>;
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

function PublishModal({
  isOpenModal: isOpenPublishModal,
  setOpenModal: setOpenPublishModal,
}: PublishModalProps) {
  const { saveDraft, cancelPendingAutosaves } = useBlogEditorContext();
  const { mutate: mutatePublish } = useBlogPublish();
  const { id: blogId } = useParams();

  if (!isOpenPublishModal) return;

  async function handlePublish() {
    if (!blogId) {
      toast.error("Something went wrong, blogId required");
      return;
    }

    cancelPendingAutosaves();

    const saved = await saveDraft();
    if (!saved) {
      toast.error("Could not save the latest blog changes");
      return;
    }

    mutatePublish(blogId);
  }

  return (
    <ModalOverlay isShow={isOpenPublishModal} setIsShow={setOpenPublishModal}>
      <h3>Are you sure you want to publish this blog?</h3>

      <div className={styles.modalFooter}>
        <button
          className="btn-secondary"
          onClick={() => setOpenPublishModal(false)}>
          Cancel
        </button>

        <button className="btn-primary" onClick={handlePublish}>
          Publish
        </button>
      </div>
    </ModalOverlay>
  );
}

function ActionBtns({
  onPreview,
  saveDraft,
  saveStatus,
  setOpenModal,
}: ActionBtnsProps) {
  return (
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

      <button
        type="button"
        className="btn-primary"
        onClick={() => setOpenModal(true)}>
        <LuSend />
        Publish
      </button>
    </div>
  );
}

function BlogEditorHeader({ onPreview }: BlogEditorHeaderProps) {
  const { saveStatus, saveDraft } = useBlogEditorContext();
  const status = saveStatusConfig[saveStatus];
  const [isOpenModal, setOpenModal] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.titleAndAction}>
        <div className={styles.headerTitle}>
          <span>Write a Blog</span>

          <span className={`${styles.status} ${status.className}`}>
            {status.text}
          </span>
        </div>

        <ActionBtns
          onPreview={onPreview}
          saveDraft={saveDraft}
          saveStatus={saveStatus}
          setOpenModal={setOpenModal}
        />
      </div>

      <p className={`highlight-txt ${styles.notice}`}>
        This blog will be hidden from search results until you publish it again.
      </p>

      <PublishModal isOpenModal={isOpenModal} setOpenModal={setOpenModal} />
    </header>
  );
}

export default BlogEditorHeader;

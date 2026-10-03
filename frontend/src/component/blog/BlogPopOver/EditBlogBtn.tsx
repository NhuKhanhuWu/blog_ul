/** @format */
import styles from "./BlogPopOver.module.scss";

import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import useEditExistingBlog from "../../../hook/blog/useEditExistingBlog";
import ModalOverlay from "../../ui/Modal/Modal";
import { useState } from "react";
import { BlogPopOverProps } from "./BlogPopOver";

function EditBlogBtn({ blog }: BlogPopOverProps) {
  const { mutate: mutateEditBlog } = useEditExistingBlog();
  const navigate = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState(false);

  function handleDraftBlog() {
    // turn blog to draf
    mutateEditBlog(blog._id, {
      onSuccess: () => {
        // redirect to edit page
        navigate(`/blog/edit/${blog._id}`);
      },
    });
  }

  return (
    <>
      <button onClick={() => setIsOpenModal(true)} className={styles.popItem}>
        <MdEdit className={styles.icon} /> Edit blog
      </button>

      <ModalOverlay isShow={isOpenModal} setIsShow={setIsOpenModal}>
        <div className={styles.modal}>
          <strong>
            Are you sure you want to edit this blog? It will be hidden from
            search results while you make changes.
          </strong>

          <div className={styles.modalFooter}>
            <button
              onClick={() => setIsOpenModal(false)}
              className="btn-secondary">
              Cancel
            </button>

            <button onClick={() => handleDraftBlog()} className="btn-primary">
              Edit
            </button>
          </div>
        </div>
      </ModalOverlay>
    </>
  );
}

export default EditBlogBtn;

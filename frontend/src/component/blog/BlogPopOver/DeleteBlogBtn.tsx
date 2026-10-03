/** @format */
import styles from "./BlogPopOver.module.scss";

import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import ModalOverlay from "../../ui/Modal/Modal";
import useDeleteBlog from "../../../hook/blog/useDeleteBlog";
import { BlogPopOverProps } from "./BlogPopOver";

function DeleteBlogBtn({ blog }: BlogPopOverProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { mutate } = useDeleteBlog();

  return (
    <>
      <button onClick={() => setIsOpenModal(true)} className={styles.popItem}>
        <MdDeleteOutline className={styles.icon} /> Delete blog
      </button>

      <ModalOverlay isShow={isOpenModal} setIsShow={setIsOpenModal}>
        <div className={styles.modal}>
          <strong>
            Are you sure you want to delete this blog? This action can't be
            undone
          </strong>

          <div className={styles.modalFooter}>
            <button
              onClick={() => setIsOpenModal(false)}
              className="btn-secondary">
              Cancel
            </button>

            <button className="btn-primary" onClick={() => mutate(blog._id)}>
              Delete
            </button>
          </div>
        </div>
      </ModalOverlay>
    </>
  );
}

export default DeleteBlogBtn;

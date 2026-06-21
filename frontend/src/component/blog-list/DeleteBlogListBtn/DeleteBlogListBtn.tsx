/** @format */
import useDeleteList from "../../../hook/blog-list/useDeleteList";
import toast from "react-hot-toast";
import ModalOverlay from "../../ui/Modal/Modal";
import { ReactNode, useState } from "react";
import styles from "./DeleteBlogListBtn.module.scss";

interface EditBlogListBtnProps {
  blogListId: string;
  btnContent: ReactNode;
}

function DeleteBlogListBtn({ blogListId, btnContent }: EditBlogListBtnProps) {
  const { mutate } = useDeleteList();
  const [isDelete, setIsDelete] = useState(false);

  function handleDelete() {
    mutate(blogListId, {
      onSuccess: () => {
        toast.success("List deleted");
      },
    });
  }

  return (
    <>
      <button onClick={() => setIsDelete(true)}>{btnContent}</button>

      <ModalOverlay isShow={isDelete} setIsShow={setIsDelete}>
        <div className={styles.deleteModal}>
          <h4>Are you sure to delete this list?</h4>

          <div className={styles.deleteConfirmBtns}>
            <button className="btn-secondary" onClick={() => handleDelete()}>
              Yes
            </button>

            <button className="btn-primary" onClick={() => setIsDelete(false)}>
              No
            </button>
          </div>
        </div>
      </ModalOverlay>
    </>
  );
}

export default DeleteBlogListBtn;

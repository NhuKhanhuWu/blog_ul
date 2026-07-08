/** @format */

import { ReactNode, useState } from "react";
import { useCmtItem } from "../../../context/CmtItemContext";
import useDeleteCmt from "../../../hook/cmt/useDeleteCmt";
import ModalOverlay from "../../ui/Modal/Modal";
import styles from "./DeleteCmtBtn.module.scss";
import toast from "react-hot-toast";

interface DeleteCmtBtnProps {
  cmtId: string;
  children: ReactNode;
}

function DeleteCmtBtn({ children }: DeleteCmtBtnProps) {
  const { cmt } = useCmtItem().state;
  const { mutate } = useDeleteCmt();
  const [isDelete, setIsDelete] = useState(false);

  function handleDelete() {
    mutate(cmt?._id || "", {
      onSuccess: () => toast.success("Comment deleted"),
    });
  }

  return (
    <>
      <div onClick={() => setIsDelete(true)}>{children}</div>

      {/* confirm modal */}
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

export default DeleteCmtBtn;

/** @format */

import { Dispatch, ReactNode, SetStateAction } from "react";
import styles from "../styles/component/Modal.module.scss";

interface IModalOverlay {
  isShow: boolean;
  setIsShow: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}

const ModalOverlay = ({ isShow, setIsShow, children }: IModalOverlay) => {
  if (!isShow) return null;

  const handleClose = () => {
    setIsShow(false);
  };

  return (
    <div className={styles.overlayContainer} onClick={handleClose}>
      {/* to stop event to bubbling up */}
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default ModalOverlay;

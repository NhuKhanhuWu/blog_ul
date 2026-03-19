/** @format */
import { Dispatch, SetStateAction } from "react";
import styles from "../../styles/component/BlogCmt.module.scss";
import defaultAvatar from "../../utils/defaultAvatar";
import { ICmt } from "../../interface/cmtTypes";

export interface ICmtMinimize {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  cmts: ICmt[];
  totalCmts: number;
}

function CmtMinimize({ isOpen, setIsOpen, cmts, totalCmts }: ICmtMinimize) {
  return (
    <div
      className={`${isOpen ? "hidden" : ""} ${styles.cmtMinimize}`}
      onClick={() => setIsOpen(true)}>
      <p>{totalCmts} comment(s)</p>
      <div>
        <img
          className={styles.avatar}
          src={cmts[0].userId.avatar || defaultAvatar(cmts[0].userId.name)}
          loading="lazy"
        />
        <p>{cmts[0].content.slice(0, 100)}...</p>
      </div>
    </div>
  );
}

export default CmtMinimize;

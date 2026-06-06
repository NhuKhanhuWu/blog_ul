/** @format */
import { Dispatch, SetStateAction } from "react";
import styles from "./CmtMinimize.module.scss";
import defaultAvatar from "../../../utils/default-avatar";
import { Cmt } from "../../../types/comment.type";

export interface ICmtMinimize {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  cmts: Cmt[];
  totalCmts: number;
}

function CmtMinimize({ isOpen, setIsOpen, cmts, totalCmts }: ICmtMinimize) {
  return (
    <div
      className={`${isOpen ? "hidden" : ""} ${styles.cmtMinimize}`}
      onClick={() => setIsOpen(true)}>
      <p>{totalCmts} comment(s)</p>

      {cmts.length > 0 && (
        <div>
          <img
            className="avatar-sm"
            src={cmts[0].userId.avatar || defaultAvatar(cmts[0].userId.name)}
            loading="lazy"
          />
          <p>{cmts[0].content.slice(0, 100)}...</p>
        </div>
      )}
    </div>
  );
}

export default CmtMinimize;

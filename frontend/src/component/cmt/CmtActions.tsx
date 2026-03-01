/** @format */

import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { ICmt } from "../../interface/cmt";
import styles from "../../styles/component/BlogCmt.module.scss";
import { MdOutlineMessage } from "react-icons/md";

function CmtActions({ cmt }: { cmt: ICmt }) {
  return (
    <div className={styles.cmtActions}>
      <span>
        <FaRegThumbsUp />
        {cmt.upVotes || ""}
      </span>

      <span>
        <FaRegThumbsDown />
      </span>

      <span>
        <MdOutlineMessage /> {cmt.replyCount > 0 && cmt.replyCount}
      </span>
    </div>
  );
}

export default CmtActions;

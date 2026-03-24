/** @format */

import {
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaThumbsDown,
  FaThumbsUp,
} from "react-icons/fa";
import { ICmt } from "../../interface/cmtTypes";
import styles from "../../styles/component/BlogCmt.module.scss";
import { MdOutlineMessage } from "react-icons/md";
import { useToggleVote } from "../../hook/useToggleVote";

function CmtActions({ cmt }: { cmt: ICmt }) {
  // TODO: handle logic for upvote/down vote (send request & show button accordingly)
  const { mutate, isPending } = useToggleVote();

  const handleVote = (type: 1 | -1) => {
    if (isPending) return;
    mutate({ targetId: cmt._id, voteType: type, targetType: "comment" });
  };

  return (
    <div className={styles.cmtActions}>
      {/* up vote */}
      <span
        className={isPending ? "disabled" : ""}
        onClick={() => handleVote(1)}>
        {cmt.voteType === 1 ? <FaThumbsUp /> : <FaRegThumbsUp />}

        {cmt.upVotes || ""}
      </span>

      {/* down vote */}
      <span
        className={isPending ? "disabled" : ""}
        onClick={() => handleVote(-1)}>
        {cmt.voteType === -1 ? <FaThumbsDown /> : <FaRegThumbsDown />}
      </span>

      <span>
        <MdOutlineMessage />
      </span>
    </div>
  );
}

export default CmtActions;

/** @format */

import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { ICmt } from "../../interface/cmtTypes";
import styles from "../../styles/component/BlogCmt.module.scss";
import { MdOutlineMessage } from "react-icons/md";
import { useToggleVote } from "../../hook/useToggleVote";

function CmtActions({ cmt }: { cmt: ICmt }) {
  const { mutate, isPending } = useToggleVote();

  const handleVote = (type: 1 | -1) => {
    // Gọi mutation
    mutate({
      targetId: cmt._id,
      voteType: type, // 1: 'up vote/like' hoặc 'down vote/dislike'
      targetType: "comment",
    });
  };

  return (
    <div className={styles.cmtActions}>
      <span>
        <FaRegThumbsUp
          onClick={() => handleVote(1)}
          className={isPending ? "disabled" : ""}
        />
        {cmt.upVotes || ""}
      </span>

      <span>
        <FaRegThumbsDown className={isPending ? "disabled" : ""} />
      </span>

      <span>
        <MdOutlineMessage /> {cmt.replyCount > 0 && cmt.replyCount}
      </span>
    </div>
  );
}

export default CmtActions;

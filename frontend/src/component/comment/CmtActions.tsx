/** @format */

import {
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaThumbsDown,
  FaThumbsUp,
} from "react-icons/fa";
import { Cmt } from "../../types/comment.type";
import styles from "../../styles/component/BlogCmt.module.scss";
import { MdOutlineMessage } from "react-icons/md";
import { useToggleVote } from "../../hook/useToggleVote";
import { useState } from "react";
import CmtForm from "./CmtForm";

function CmtActions({ cmt }: { cmt: Cmt }) {
  const { mutate, isPending } = useToggleVote();
  const [isRepling, setIsRepling] = useState(false);

  const handleVote = (type: 1 | -1) => {
    if (isPending) return;
    mutate({ targetId: cmt._id, voteType: type, targetType: "comment" });
  };

  return (
    <>
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

        <span onClick={() => setIsRepling(true)}>
          <MdOutlineMessage />
        </span>
      </div>

      {/* reply cmt's form */}
      {isRepling && (
        <CmtForm
          blogId={cmt.blogId}
          parentId={cmt._id}
          isUsing={isRepling}
          setIsUsing={setIsRepling}
        />
      )}
    </>
  );
}

export default CmtActions;

/** @format */

import { useState } from "react";
import { useAppSelector } from "../../../hook/reduxHooks";
import { useToggleBlogVote } from "../../../hook/vote/useToggleVote";
import { NormalizedBlog } from "../../../types/blog.type";
import ModalOverlay from "../../ui/Modal/Modal";
import LoginMessage from "../../ui/LoginMessageModal/LoginMessage";
import {
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaThumbsDown,
  FaThumbsUp,
} from "react-icons/fa";
import styles from "./Vote.module.scss";

function Vote({ blog }: { blog: NormalizedBlog }) {
  const { mutate, isPending } = useToggleBlogVote(blog.slug);
  const isLogin = useAppSelector((state) => state.auth.isAuthenticated);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleVote = (type: 1 | -1) => {
    if (!isLogin) {
      setIsOpenModal(true);
      return;
    }

    if (isPending) return;
    mutate({ targetId: blog._id, voteType: type, targetType: "blog" });
  };

  return (
    <div className={`${styles.votes} btn`}>
      {/* not login modal */}
      <ModalOverlay isShow={isOpenModal} setIsShow={setIsOpenModal}>
        <LoginMessage
          header="Want to votw this blog"
          message="Login to vote for your favorite blog"
        />
      </ModalOverlay>

      {/* upvote */}
      <span className={styles.icon} onClick={() => handleVote(1)}>
        {blog.voteType === 1 ? <FaThumbsUp /> : <FaRegThumbsUp />}
        {blog.upVotes > 0 && blog.upVotes}
      </span>

      {/* downvote */}
      <span className={styles.icon} onClick={() => handleVote(-1)}>
        {blog.voteType === -1 ? <FaThumbsDown /> : <FaRegThumbsDown />}
      </span>
    </div>
  );
}

export default Vote;

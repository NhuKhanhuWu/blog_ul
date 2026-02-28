/** @format */
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { MdOutlineMessage } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { getDateDistance } from "../../utils/date";
import { Link } from "react-router-dom";
import styles from "../../styles/component/BlogCmt.module.scss";
import { ICmt } from "../../interface/cmt";
import { useState } from "react";
import defaultAvatar from "../../utils/defaultAvatar";

function CmtItem({ cmt }: { cmt: ICmt }) {
  const [isExpand, setIsExpand] = useState(false);

  return (
    <div className={styles.cmtItem}>
      {/* img */}
      <img
        className={styles.avatar}
        src={cmt.userId.avatar ?? defaultAvatar(cmt.userId.slug)}
        loading="lazy"
      />

      {/* text */}
      <div className={styles.cmtTxt}>
        {/* user name & timestapm => cmtItemHeader*/}
        <div className={styles.cmtItemHeader}>
          <Link to={`/profile/${cmt.userId.slug}`}>{cmt.userId.name}</Link>
          <span>{getDateDistance(cmt.createdAt)}</span>
        </div>

        {/* content */}
        <p
          key={cmt._id}
          className={`${styles.cmtContent} ${isExpand && styles.expand}`}>
          {cmt.content}
        </p>
        {!isExpand && cmt.content.length > 200 && (
          <span onClick={() => setIsExpand(true)} className={styles.seeMoreBtn}>
            See more
          </span>
        )}

        {/* votes & replies btn */}
        <div className={styles.cmtBtns}>
          <span>
            <FaRegThumbsUp />
            {cmt.upVotes || ""}
          </span>

          <span>
            <FaRegThumbsDown />
          </span>

          <MdOutlineMessage />
        </div>

        {/* show replies */}
        {cmt.replyCount > 0 && (
          <button>
            Show {cmt.replyCount} replies <IoIosArrowDown />
          </button>
        )}
      </div>
    </div>
  );
}

export default CmtItem;

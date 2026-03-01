/** @format */

import { Dispatch, SetStateAction } from "react";
import { ICmt } from "../../interface/cmt";
import styles from "../../styles/component/BlogCmt.module.scss";
import { Link } from "react-router-dom";
import { getDateDistance } from "../../utils/date";

interface ICmtTxt {
  cmt: ICmt;
  isExpand: boolean;
  setIsExpand: Dispatch<SetStateAction<boolean>>;
}

function CmtContent({ cmt, isExpand, setIsExpand }: ICmtTxt) {
  return (
    <>
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
    </>
  );
}

export default CmtContent;

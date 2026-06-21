/** @format */

import { Cmt } from "../../../types/comment.type";
import styles from "./CmtContent.module.scss";
import { Link } from "react-router-dom";
import { getDateDistance } from "../../../utils/date";
import { ShowMoreText } from "../../ui/ShowMoreText/ShowMoreText";

interface ICmtTxt {
  cmt: Cmt;
}

function CmtContent({ cmt }: ICmtTxt) {
  return (
    <>
      {/* user name & timestapm => cmtItemHeader*/}
      <div className={styles.cmtItemHeader}>
        <Link to={`/profile/${cmt.userId?.slug}`}>{cmt.userId?.name}</Link>
        <span>{getDateDistance(cmt.createdAt)}</span>
      </div>

      {/* content */}
      <div className={styles.cmtContent}>
        <ShowMoreText text={cmt.content} lines={4} />
      </div>
    </>
  );
}

export default CmtContent;

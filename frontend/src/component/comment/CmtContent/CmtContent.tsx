/** @format */

import styles from "./CmtContent.module.scss";
import { Link } from "react-router-dom";
import { getDateDistance } from "../../../utils/date";
import { ShowMoreText } from "../../ui/ShowMoreText/ShowMoreText";
import CmtPopover from "../CmtPopover/CmtPopover";
import { useAppSelector } from "../../../hook/shared/reduxHooks";
import { useCmtItem } from "../../../context/CmtItemContext";
import { buildCmtContentNode } from "../../../utils/buildCmtContentNode";

function CmtContent() {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const cmt = useCmtItem().state.cmt;

  if (!cmt) return;

  return (
    <>
      {/* user name & timestapm => cmtItemHeader*/}
      <div className={styles.cmtItemHeader}>
        <div>
          <Link to={`/profile/${cmt.userId?.slug}`}>{cmt.userId?.name}</Link>{" "}
          <span>{getDateDistance(cmt.createdAt)}</span>
        </div>

        {/* popover */}
        {userId === cmt.userId._id && <CmtPopover cmt={cmt} />}
      </div>

      {/* content */}
      <div className={styles.cmtContent}>
        <ShowMoreText
          text={buildCmtContentNode({
            content: cmt.content,
            mentions: cmt.mentions,
          })}
          lines={4}
        />
      </div>
    </>
  );
}

export default CmtContent;

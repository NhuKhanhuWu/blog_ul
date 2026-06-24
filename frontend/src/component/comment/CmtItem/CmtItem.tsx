/** @format */
import { Link } from "react-router-dom";
import styles from "./CmtItem.module.scss";
import { Cmt } from "../../../types/comment.type";
import { memo, useMemo, useState, ReactNode } from "react";
import defaultAvatar from "../../../utils/default-avatar";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCmtByBlog } from "../../../api/comment.api";
import CmtContent from "../CmtContent/CmtContent";
import CmtActions from "../CmtActions/CmtActions";
import ReplyBtns from "../ReplyBtns/ReplyBtns";

// Component bọc ngoài để quản lý style chung
const CmtLayout = ({ cmt, children }: { cmt: Cmt; children: ReactNode }) => (
  <div className={styles.cmtItemContainer}>
    <Link to={`/profile/${cmt.userId.slug}`}>
      <img
        className={cmt.parentId ? "avatar-sm" : "avatar-md"}
        src={cmt.userId.avatar ?? defaultAvatar(cmt.userId.slug)}
        loading="lazy"
        alt="avatar"
      />
    </Link>
    <div className={styles.cmt}>{children}</div>
  </div>
);

const CmtItem = memo(({ cmt, depth = 0 }: { cmt: Cmt; depth?: number }) => {
  const [isShowReply, setIsShowReply] = useState(false);

  // Logic fetch dữ liệu lồng vào đúng nơi cần thiết
  const { data, isFetchingNextPage, isError, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["cmt-replies", cmt._id.toString()],
      queryFn: ({ pageParam = 0 }) =>
        getCmtByBlog({
          blogId: cmt.blogId,
          sort: "createdAt",
          page: pageParam,
          limit: 3,
          parentId: cmt._id,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      enabled: isShowReply && depth < 3, // avoidl infinite fetch when open reply and have more than 3 level of reply
    });

  const replies = useMemo(
    () => data?.pages.flatMap((p) => p.data) || [],
    [data],
  );

  return (
    <CmtLayout cmt={cmt}>
      {/* main content */}
      <div className={styles.cmtTxt}>
        <CmtContent cmt={cmt} />
        <CmtActions cmt={cmt} />
      </div>

      {/* replies: only render when open */}
      {isShowReply && (
        <div className={styles.repliesList}>
          {isError && <span className="error-mgs">Error loading replies</span>}
          {replies.map((reply) => (
            <CmtItem key={reply._id} cmt={reply} depth={depth + 1} />
          ))}
        </div>
      )}

      <ReplyBtns
        cmt={cmt}
        isOpen={isShowReply}
        onToggle={() => setIsShowReply(!isShowReply)}
        hasNextPage={hasNextPage}
        onFetchNext={fetchNextPage}
        isFetching={isFetchingNextPage}
      />
    </CmtLayout>
  );
});

export default CmtItem;

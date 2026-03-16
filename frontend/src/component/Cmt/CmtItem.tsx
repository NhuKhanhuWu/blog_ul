/** @format */
import { Link } from "react-router-dom";
import styles from "../../styles/component/BlogCmt.module.scss";
import { ICmt } from "../../interface/cmtTypes";
import { memo, useMemo, useState, ReactNode } from "react";
import defaultAvatar from "../../utils/defaultAvatar";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCmtByBlog } from "../../api/cmt/getCmt";
import CmtContent from "./CmtContent";
import CmtActions from "./CmtActions";
import ReplyBtns from "./ReplyBtns";

// Component bọc ngoài để quản lý style chung
const CmtLayout = ({ cmt, children }: { cmt: ICmt; children: ReactNode }) => (
  <div className={styles.cmtItemContainer}>
    <Link to={`/profile/${cmt.userId.slug}`}>
      <img
        className={styles.avatar}
        src={cmt.userId.avatar ?? defaultAvatar(cmt.userId.slug)}
        loading="lazy"
        alt="avatar"
      />
    </Link>
    <div className={styles.cmt}>{children}</div>
  </div>
);

const CmtItem = memo(({ cmt, depth = 0 }: { cmt: ICmt; depth?: number }) => {
  const [isExpand, setIsExpand] = useState(false);
  const [isShowReply, setIsShowReply] = useState(false);

  // Logic fetch dữ liệu lồng vào đúng nơi cần thiết
  const { data, isFetchingNextPage, isError, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["cmt-replies", cmt._id],
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
      enabled: isShowReply && depth < 3, // Chống đệ quy vô hạn
    });

  const replies = useMemo(
    () => data?.pages.flatMap((p) => p.data) || [],
    [data],
  );

  return (
    <CmtLayout cmt={cmt}>
      {/* Phần nội dung chính */}
      <div className={styles.cmtTxt}>
        <CmtContent cmt={cmt} isExpand={isExpand} setIsExpand={setIsExpand} />
        <CmtActions cmt={cmt} />
      </div>

      {/* Danh sách replies: Chỉ render khi mở */}
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

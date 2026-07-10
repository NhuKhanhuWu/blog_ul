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
import {
  CommentItemProvider,
  useCmtItem,
} from "../../../context/CmtItemContext";
import CmtEditForm from "../CmtEditForm/CmtEditForm";

// layout Component to manage style
function CmtLayout({ children }: { children: ReactNode }) {
  const { isEdit } = useCmtItem().state;
  const { cmt } = useCmtItem().state;

  // if cmt is deleted => cmt===null
  if (!cmt) return;

  // if is editing cmt
  if (isEdit) return <CmtEditForm />;

  return (
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
}

const CmtItem = memo(({ cmt, depth = 0 }: { cmt: Cmt; depth?: number }) => {
  const [isShowReply, setIsShowReply] = useState(false);

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

      enabled: isShowReply,
    });

  const replies = useMemo(
    () => data?.pages.flatMap((p) => p.data) || [],
    [data],
  );

  const nextDepth = Math.min(depth + 1, 2);

  return (
    <CommentItemProvider initCmt={cmt}>
      <CmtLayout>
        <div className={styles.cmtTxt}>
          <CmtContent />
          <CmtActions cmt={cmt} />
        </div>

        {isShowReply && (
          <div className={styles.repliesList}>
            {isError && (
              <span className="error-mgs">Error loading replies</span>
            )}
            {replies.map((reply) => (
              <CmtItem key={reply._id} cmt={reply} depth={nextDepth} />
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
    </CommentItemProvider>
  );
});

export default CmtItem;

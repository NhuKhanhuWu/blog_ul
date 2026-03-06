/** @format */
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Link } from "react-router-dom";
import styles from "../../styles/component/BlogCmt.module.scss";
import { ICmt } from "../../interface/cmt";
import { Dispatch, memo, SetStateAction, useMemo, useState } from "react";
import defaultAvatar from "../../utils/defaultAvatar";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCmtByBlog } from "../../api/cmt/getCmt";
import CmtContent from "./CmtContent";
import CmtActions from "./CmtActions";

interface IReplies {
  replies: ICmt[];
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

interface ILoadRepliesBtn {
  cmt: ICmt;
  replies: ICmt[];
  isShowReplies: boolean;
  setShowReplies: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  isError: boolean;
}

function Replies({
  replies,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: IReplies) {
  return (
    <>
      <div className={styles.repliesList}>
        {replies.map((reply) => (
          <CmtItem key={reply._id} cmt={reply} />
        ))}

        {/* load more btn for the replies if there are more */}
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className={styles.loadMoreSmall}>
            {isFetchingNextPage ? "Loading..." : "Show more replies"}
          </button>
        )}
      </div>
    </>
  );
}

function LoadRepliesBtn({
  cmt,
  replies,
  isShowReplies,
  setShowReplies,
  isLoading,
  isError,
}: ILoadRepliesBtn) {
  if (isLoading) return <button className="disabled">Loading...</button>;

  if (isError) return <span className="error-mgs">Something went wrong</span>;

  return (
    <button onClick={() => setShowReplies(!isShowReplies)}>
      {cmt.replyCount > replies.length || !isShowReplies ? (
        <>
          Show replies <IoIosArrowDown />
        </>
      ) : (
        <>
          Hide replies <IoIosArrowUp />
        </>
      )}
    </button>
  );
}

const CmtItem = memo(({ cmt }: { cmt: ICmt }) => {
  const [isExpand, setIsExpand] = useState(false);
  const [isShowReply, setIsShowReply] = useState(false);
  const { blogId = "" } = cmt;

  const { data, isFetchingNextPage, isError, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["cmt", blogId, cmt._id],
      queryFn: ({ pageParam = 0 }) =>
        getCmtByBlog({
          blogId,
          sort: "createdAt",
          pageParam,
          parentId: cmt._id,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      enabled: isShowReply,
    });
  const replies = useMemo(
    () => data?.pages.flatMap((p) => p.data) || [],
    [data?.pages],
  );

  return (
    <div className={styles.cmtItemContainer}>
      {/* --------- avatar ----------- */}
      <Link to={`/profile/${cmt.userId.slug}`}>
        <img
          className={styles.avatar}
          src={cmt.userId.avatar ?? defaultAvatar(cmt.userId.slug)}
          loading="lazy"
        />
      </Link>

      {/* -------- content-------- */}
      <div className={styles.cmt}>
        {/* text */}
        <div className={styles.cmtTxt}>
          {/* include user name, timestamp, cmt's content */}
          <CmtContent cmt={cmt} isExpand={isExpand} setIsExpand={setIsExpand} />

          {/* votes & replies btn */}
          <CmtActions cmt={cmt} />
        </div>

        {/* replies */}
        {isShowReply && (
          <Replies
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            replies={replies}
          />
        )}

        {/* show replies btn */}
        {cmt.replyCount > 0 && (
          <LoadRepliesBtn
            cmt={cmt}
            isShowReplies={isShowReply}
            replies={replies}
            setShowReplies={setIsShowReply}
            isError={isError}
            isLoading={isFetchingNextPage}
          />
        )}
      </div>
    </div>
  );
});

export default CmtItem;

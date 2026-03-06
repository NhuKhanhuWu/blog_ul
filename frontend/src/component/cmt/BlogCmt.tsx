/** @format */

import { Dispatch, ReactNode, SetStateAction, useMemo, useState } from "react";
import { Sheet } from "react-modal-sheet";

import defaultAvatar from "../../utils/defaultAvatar";
import { ICmt } from "../../interface/cmt";
import Loader from "../Loader";
import Error from "../Error";
import CmtForm from "./CmtForm";
import styles from "../../styles/component/BlogCmt.module.scss";
import { useIntersectionObserver } from "../../hook/useIntersectionObserver";
import InfinityObserver from "../InfinityObserver";
import CmtItem from "./CmtItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCmtByBlog } from "../../api/cmt/getCmt";

interface ICmtMinimize {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  cmts: ICmt[];
  totalCmt: number;
}

interface ICmtModal extends ICmtMinimize {
  setSort: Dispatch<SetStateAction<string>>;
  children?: ReactNode;
}

function CmtMinimize({ isOpen, setIsOpen, cmts, totalCmt }: ICmtMinimize) {
  return (
    <div
      className={`${isOpen ? "hidden" : ""} ${styles.cmtMinimize}`}
      onClick={() => setIsOpen(true)}>
      <p>{totalCmt} comment(s)</p>
      <div>
        <img
          className={styles.avatar}
          src={cmts[0].userId.avatar || defaultAvatar(cmts[0].userId.name)}
          loading="lazy"
        />
        <p>{cmts[0].content.slice(0, 100)}...</p>
      </div>
    </div>
  );
}

function CmtModal({
  isOpen,
  setIsOpen,
  setSort,
  totalCmt,
  cmts,
  children: loadAndErr,
}: ICmtModal) {
  return (
    <Sheet
      className={!isOpen ? "hidden" : ""}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}>
      <Sheet.Container className={styles.cmtContainer}>
        <Sheet.Header className={styles.header}>
          {/* <div className={styles.header}> */}
          <p>{totalCmt} comments</p>

          <select name="sort" onChange={(e) => setSort(e.target.value)}>
            <option value="-upVotes">Most related</option>
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
          </select>
          {/* </div> */}
        </Sheet.Header>

        <Sheet.Content>
          <CmtForm />

          <div className={styles.cmts}>
            {cmts.map((cmt) => (
              <CmtItem cmt={cmt} key={cmt._id} />
            ))}

            {loadAndErr}
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop />
    </Sheet>
  );
}

function BlogCmtMobile({ blogId }: { blogId: string }) {
  const [sort, setSort] = useState("-upVotes");
  const [isOpen, setIsOpen] = useState(false);

  const {
    data,
    isPending,
    isFetchingNextPage,
    isError,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["cmt", sort, blogId],
    queryFn: ({ pageParam = 0 }) => getCmtByBlog({ blogId, sort, pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
  const cmts = useMemo(
    () => data?.pages.flatMap((p) => p.data) || [],
    [data?.pages],
  );
  const totalCmt = data?.pages[0].totalResult || 0;

  const { lastElementRef } = useIntersectionObserver(
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  );

  return (
    <>
      {/* top cmt/open cmt btn */}
      {!isPending && !isError && (
        <CmtMinimize
          cmts={cmts}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          totalCmt={totalCmt}
        />
      )}

      <CmtModal
        cmts={cmts}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setSort={setSort}
        totalCmt={totalCmt}
        children={
          <>
            {isError && <Error />}
            <InfinityObserver lastElementRef={lastElementRef}>
              {isFetchingNextPage ? <Loader /> : ""}
            </InfinityObserver>
          </>
        }></CmtModal>
    </>
  );
}

function BlogCmt({ blogId }: { blogId: string }) {
  return (
    <>
      <BlogCmtMobile blogId={blogId} />
    </>
  );
}

export default BlogCmt;

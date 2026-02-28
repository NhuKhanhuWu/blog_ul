/** @format */

import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Sheet } from "react-modal-sheet";

import defaultAvatar from "../../utils/defaultAvatar";
import { ICmt } from "../../interface/cmt";
import Loader from "../Loader";
import Error from "../Error";
import CmtForm from "./CmtForm";
import styles from "../../styles/component/BlogCmt.module.scss";
import { useGetCmtByBlog } from "../../hook/useCmt";
import { useIntersectionObserver } from "../../hook/useIntersectionObserver";
import InfinityObserver from "../InfinityObserver";
import CmtItem from "./CmtItem";

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
      <Sheet.Container>
        <Sheet.Header />

        <Sheet.Content className={styles.cmtContainer}>
          <div className={styles.header}>
            <p>{totalCmt} comments</p>

            <select name="sort" onChange={(e) => setSort(e.target.value)}>
              <option value="-upVotes">Most related</option>
              <option value="-createdAt">Newest</option>
              <option value="createdAt">Oldest</option>
            </select>
          </div>

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
    cmts,
    totalCmt,
    isPending,
    isFetchingNextPage,
    isError,
    hasNextPage,
    fetchNextPage,
  } = useGetCmtByBlog({ blogId, sort });

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

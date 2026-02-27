/** @format */

import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { MdOutlineMessage } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Link } from "react-router-dom";
import { Sheet } from "react-modal-sheet";

import defaultAvatar from "../../utils/defaultAvatar";
import { getDateDistance } from "../../utils/date";
import { ICmt } from "../../interface/cmt";
import Loader from "../Loader";
import Error from "../Error";
import CmtForm from "./CmtForm";
import styles from "../../styles/component/BlogCmt.module.scss";
import { useGetCmtByBlog } from "../../hook/useCmt";
import { useIntersectionObserver } from "../../hook/useIntersectionObserver";
import InfinityObserver from "../InfinityObserver";

interface ICmtMinimize {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  cmts: ICmt[];
  totalCmt: number;
}

interface ICmtModal extends ICmtMinimize {
  setSort: Dispatch<SetStateAction<string>>;
  children: ReactNode;
}

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
            Show replies <IoIosArrowDown />
          </button>
        )}
      </div>
    </div>
  );
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

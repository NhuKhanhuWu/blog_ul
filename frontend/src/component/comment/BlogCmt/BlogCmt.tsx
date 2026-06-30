/** @format */

import { useState } from "react";
import Loader from "../../ui/Loader/Loader.tsx";
import Error from "../../ui/Error/Error.tsx";
import { useIntersectionObserver } from "../../../hook/shared/useIntersectionObserver.ts";
import InfinityObserver from "../../ui/InfinityObserver/InfinityObserver.tsx";
import CmtMinimize from "../CmtMinimize/CmtMinimize.tsx";
import CmtModal from "../CmtModal/CmtModal.tsx";
import useGetBlogCmt from "../../../hook/cmt/useGetBlogCmt.ts";
import CmtItem from "../CmtItem/CmtItem.tsx";
import toast from "react-hot-toast";
import { useMediaQuery } from "react-responsive";
import styles from "./BlogCmt.module.scss";
import CmtCreateForm from "../CmtCreateForm/CmtCreateForm.tsx";

interface IBlogInfor {
  blogId: string;
  totalCmts: number;
}

function BlogCmtMobile({ blogId, totalCmts }: IBlogInfor) {
  const [sort, setSort] = useState("top");
  const [isOpen, setIsOpen] = useState(false);

  const {
    cmts,
    isPending,
    isFetchingNextPage,
    isError,
    hasNextPage,
    fetchNextPage,
  } = useGetBlogCmt({ blogId, sort });

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
          totalCmts={totalCmts}
        />
      )}

      <CmtModal
        cmts={cmts}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setSort={setSort}
        totalCmts={totalCmts}
        blogId={blogId}
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

function BlogCmtDesktop({ blogId, totalCmts }: IBlogInfor) {
  const [sort, setSort] = useState("top");
  const [isCommenting, setIsCommenting] = useState(false);

  const {
    cmts,
    isPending,
    isFetchingNextPage,
    isError,
    hasNextPage,
    fetchNextPage,
  } = useGetBlogCmt({ blogId, sort });
  const { lastElementRef } = useIntersectionObserver(
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  );

  if (isError)
    return toast.error("Cannot load comments, please try again later");

  return (
    <div className={styles.blogCmtDesktop}>
      {/* header */}
      <div className={styles.header}>
        <p>{totalCmts} comments</p>

        <select name="sort" onChange={(e) => setSort(e.target.value)}>
          <option value="top">Most related</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* new cmt form */}
      <div className={styles.cmtFormCotainer}>
        <CmtCreateForm
          blogId={blogId}
          isUsing={isCommenting}
          setIsUsing={setIsCommenting}
        />
      </div>

      {/* cmts */}
      <div className={styles.cmts}>
        {cmts.map((cmt) => (
          <CmtItem cmt={cmt} key={cmt._id}></CmtItem>
        ))}

        <InfinityObserver lastElementRef={lastElementRef}>
          {(isPending || isFetchingNextPage) && <Loader />}
        </InfinityObserver>
      </div>
    </div>
  );
}

function BlogCmt({ blogId, totalCmts }: IBlogInfor) {
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });

  return (
    <>
      {isDesktop ? (
        <BlogCmtDesktop blogId={blogId} totalCmts={totalCmts} />
      ) : (
        <BlogCmtMobile blogId={blogId} totalCmts={totalCmts} />
      )}
    </>
  );
}

export default BlogCmt;

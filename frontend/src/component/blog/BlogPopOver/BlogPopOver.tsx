/** @format */

import styles from "./BlogPopOver.module.scss";

import { SlOptionsVertical } from "react-icons/sl";
import { ReactNode, useState } from "react";
import { useAppSelector } from "../../../hook/shared/reduxHooks";
import { BlogSimplify } from "../../../types/blog.type";
import Popover from "@mui/material/Popover";
import BookMark from "../BookMark/BookMark";
import { Link } from "react-router-dom";
import { MdEdit, MdOutlineBookmarkBorder } from "react-icons/md";

interface BlogPopOverProps {
  blog: BlogSimplify;
  popItems?: ReactNode;
}

function BlogPopOver({ blog, popItems }: BlogPopOverProps) {
  const user = useAppSelector((state) => state.auth.user);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isOpen = Boolean(anchorEl);

  // blog list
  const blogListBtn = (
    <button className={styles.popItem}>
      <MdOutlineBookmarkBorder className={styles.icon} /> Save to blog list
    </button>
  );

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  // if user not login => return nothing
  if (!user) return;

  return (
    <>
      <button onClick={handleClick} className={styles.popBtn}>
        <SlOptionsVertical />
      </button>

      <Popover
        id={blog._id}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}>
        <div className={styles.popContent}>
          {/*  show save to list */}
          <BookMark blogId={blog._id} openBtn={blogListBtn} />

          {/* if this blog is belong to user => show edit */}
          {blog.userId === user._id && (
            <Link to={`/blog/${blog.slug}/edit`} className={styles.popItem}>
              <MdEdit className={styles.icon} /> Edit blog
            </Link>
          )}

          {popItems && <>{popItems}</>}
        </div>
      </Popover>
    </>
  );
}

export default BlogPopOver;

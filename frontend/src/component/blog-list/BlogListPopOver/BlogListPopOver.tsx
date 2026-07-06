/** @format */

import { useState } from "react";
import { useAppSelector } from "../../../hook/shared/reduxHooks";
import { BlogListPopOverProps } from "../../../types/blog-list.type";
import { SlOptionsVertical } from "react-icons/sl";
import Popover from "@mui/material/Popover";
import styles from "./BlogListPopOver.module.scss";

import EditBlogListBtn from "../EditBlogListBtn/EditBlogListBtn";
import DeleteBlogListBtn from "../DeleteBlogListBtn/DeleteBlogListBtn";
import { MdDeleteOutline, MdEdit } from "react-icons/md";

function BlogListPopOver({ blogList }: BlogListPopOverProps) {
  const user = useAppSelector((state) => state.auth.user);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isOpen = Boolean(anchorEl);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  if (user?._id !== blogList.userId) return;

  if (blogList.isDefault) return;

  return (
    <>
      <button onClick={handleClick} className={styles.popBtn}>
        <SlOptionsVertical />
      </button>

      <Popover
        id={blogList._id}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}>
        <div className={styles.popContent}>
          <EditBlogListBtn
            listId={blogList._id}
            btnContent={
              <span className={styles.popItem}>
                <MdEdit className={styles.icon} /> Edit list
              </span>
            }></EditBlogListBtn>

          <DeleteBlogListBtn
            blogListId={blogList._id}
            btnContent={
              <button className={styles.popItem}>
                <MdDeleteOutline className={styles.icon} /> Delete list
              </button>
            }
          />
        </div>
      </Popover>
    </>
  );
}

export default BlogListPopOver;

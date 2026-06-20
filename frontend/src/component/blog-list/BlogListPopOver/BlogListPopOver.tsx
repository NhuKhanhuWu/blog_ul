/** @format */

import { useState } from "react";
import { useAppSelector } from "../../../hook/reduxHooks";
import { BlogListSimplify } from "../../../types/blog-list.type";
import { SlOptionsVertical } from "react-icons/sl";
import Popover from "@mui/material/Popover";
import styles from "./BlogListPopOver.module.scss";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import BlogListForm from "../BlogListForm/BlogListForm";
import { useQuery } from "@tanstack/react-query";
import { getBlogListById } from "../../../api/blog-list.api";
import useDeleteList from "../../../hook/blog-list/useDeleteList";
import toast from "react-hot-toast";
import ModalOverlay from "../../ui/Modal/Modal";

interface BlogListPopOverProps {
  blogList: BlogListSimplify;
}

function EditBtn({ blogList }: BlogListPopOverProps) {
  const [isEdit, setIsEdit] = useState(false);
  const { data } = useQuery({
    queryKey: ["blog-list-infor", blogList._id],
    queryFn: () => getBlogListById(blogList._id),
    enabled: isEdit,
  });

  return (
    <>
      <button onClick={() => setIsEdit(true)} className={styles.popItem}>
        <MdEdit className={styles.icon} /> Edit list
      </button>

      {/* edit form */}
      {data && (
        <BlogListForm
          isOpening={isEdit}
          isUpdating={true}
          blogList={data}
          setIsOpening={setIsEdit}></BlogListForm>
      )}
    </>
  );
}

function DeleteBtn({ blogListId }: { blogListId: string }) {
  const { mutate } = useDeleteList();
  const [isDelete, setIsDelete] = useState(false);

  function handleDelete() {
    mutate(blogListId, {
      onSuccess: () => {
        toast.success("List deleted");
      },
    });
  }

  return (
    <>
      <button className={styles.popItem} onClick={() => setIsDelete(true)}>
        <MdDeleteOutline className={styles.icon} /> Delete list
      </button>

      <ModalOverlay isShow={isDelete} setIsShow={setIsDelete}>
        <div className={styles.deleteModal}>
          <h4>Are you sure to delete this list?</h4>

          <div className={styles.deleteConfirmBtns}>
            <button className="btn-secondary" onClick={() => handleDelete()}>
              Yes
            </button>

            <button className="btn-primary" onClick={() => setIsDelete(false)}>
              No
            </button>
          </div>
        </div>
      </ModalOverlay>
    </>
  );
}

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
          <EditBtn blogList={blogList}></EditBtn>

          <DeleteBtn blogListId={blogList._id} />
        </div>
      </Popover>
    </>
  );
}

export default BlogListPopOver;

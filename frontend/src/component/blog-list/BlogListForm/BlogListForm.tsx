/** @format */

import { Dispatch, SetStateAction } from "react";
import {
  BlogListData,
  blogListFormSchema,
} from "../../../types/blog-list.type";
import ModalOverlay from "../../ui/Modal/Modal";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./BlogListForm.module.scss";
import useCreateList from "../../../hook/blog-list/useCreateList";
import toast from "react-hot-toast";
import useUpdateList from "../../../hook/blog-list/useUpdateList";

interface BlogListFormFields {
  blogList: {
    name: string;
    description: string;
    isPrivate: boolean;
  };
}

type BlogListFormProps = {
  isOpening: boolean;
  setIsOpening: Dispatch<SetStateAction<boolean>>;
  blogId?: string;
} & (
  | { isUpdating: true; blogList: BlogListData } //  Required
  | { isUpdating: false; blogList?: BlogListData } //  Optional
);

function BlogListForm({
  isUpdating,
  blogList,
  isOpening,
  setIsOpening,
  blogId,
}: BlogListFormProps) {
  // handle form
  const initValue: BlogListFormFields = {
    blogList: {
      name: isUpdating && blogList ? blogList.name : "",
      description: (isUpdating && blogList ? blogList.description : "") || "",
      isPrivate: isUpdating && blogList ? blogList.isPrivate : true,
    },
  };

  const {
    register,
    handleSubmit,
    formState: { errors: formErr },
  } = useForm<BlogListFormFields>({
    resolver: yupResolver(blogListFormSchema) as Resolver<BlogListFormFields>,
    defaultValues: initValue,
  });

  // handle create request
  const { mutate: mutateCreate, isPending: isPendingCreate } =
    useCreateList(blogId);

  const { mutate: mutateUpdate, isPending: isPendingUpdate } =
    useUpdateList(blogList);

  function handleCreateList(data: BlogListFormFields) {
    // create new list
    if (!isUpdating) {
      mutateCreate(data.blogList, {
        onSuccess: () => {
          // show message
          toast.success("Blog list created");

          // close modal
          setIsOpening(false);
        },
      });
    }

    // update list
    else {
      mutateUpdate(
        { blogListId: blogList._id, data: data.blogList },
        {
          onSuccess: () => {
            // show message
            toast.success("Blog list updated");

            // close modal
            setIsOpening(false);
          },
        },
      );
    }
  }

  const isDisabled = isPendingCreate || isPendingUpdate;

  return (
    <ModalOverlay isShow={isOpening} setIsShow={setIsOpening}>
      <form className={styles.form} onSubmit={handleSubmit(handleCreateList)}>
        <p className={styles.modalHeader}>Create a new list</p>

        {/* name */}
        <div className={styles.field}>
          <label>Name</label>
          <input
            className={`input ${isDisabled && styles.disabled}`}
            {...register("blogList.name")}
          />

          {formErr.blogList?.name && (
            <p className="error-mgs">{formErr.blogList.name.message}</p>
          )}
        </div>

        {/* description */}
        <div className={styles.field}>
          <label>Description</label>
          <textarea
            className={`input ${isDisabled && styles.disabled}`}
            {...register("blogList.description")}
          />
        </div>

        {/* Privacy */}
        <div className={styles.field}>
          <label>Privacy</label>

          <select
            {...register("blogList.isPrivate")}
            className={isDisabled ? styles.disabled : ""}>
            <option value="true">Private</option>
            <option value="false">Public</option>
          </select>
        </div>

        <button className={`btn-secondary ${isDisabled && styles.disabled}`}>
          Submit
        </button>
      </form>
    </ModalOverlay>
  );
}

export default BlogListForm;

/** @format */

import * as yup from "yup";
import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAppSelector } from "../../../hook/shared/reduxHooks";
import styles from "./CmtCreateForm.module.scss";
import defaultAvatar from "../../../utils/default-avatar";
import { useCreateCmt } from "../../../hook/cmt/useCreateCmt";
import { CmtFormProps } from "../../../types/comment.type";
import toast from "react-hot-toast";
import { Dispatch, SetStateAction } from "react";

const formSchema = yup.object().shape({
  content: yup
    .string()
    .max(5000, "Comment must be at most 5000 characters")
    .required(),
});

type TFormSchema = yup.InferType<typeof formSchema>;

type CmtCreateForm = CmtFormProps & {
  onCreateCmt?: Dispatch<SetStateAction<boolean>>;
};

function CmtCreateForm({
  isUsing,
  setIsUsing,
  blogId,
  replyToId,
  replyToName,
  onCreateCmt,
}: CmtCreateForm) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formError },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  // handling send create cmt request
  const { mutate, isPending } = useCreateCmt();

  const username = useAppSelector((state) => state.auth.user?.username) || "";

  // get avatar
  const avatar =
    useAppSelector((state) => state.auth.user?.avatar) ||
    defaultAvatar(username);

  if (!isAuthenticated) {
    return (
      <p className={styles.notLoginMgs}>
        <Link to="/auth/login" className="link highlight-txt">
          Login
        </Link>{" "}
        to write your comment
      </p>
    );
  }

  function cancelCmt() {
    reset(); // reset form
    setIsUsing(false); // hide btns
  }

  function submitHandler(data: TFormSchema) {
    // send request to server
    mutate(
      { blogId, replyToId, content: data.content },
      {
        onSuccess: () => {
          // show toast message
          toast.success("Comment created");

          // show replies
          if (onCreateCmt) onCreateCmt(true);
        },

        // close form after send cmt
        onSettled: () => cancelCmt(),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className={styles.cmtForm}>
      <div className={styles.formInput}>
        <img
          loading="lazy"
          alt={username}
          src={avatar}
          className={styles.avatar}
        />
        <textarea
          onFocus={() => setIsUsing(true)}
          {...register("content")}
          placeholder={
            replyToName ? "Reply to @" + replyToName : "Write your comment"
          }
          className="input"
        />

        {isUsing && (
          <>
            <button
              type="button"
              onClick={() => cancelCmt()}
              className={`${styles.sendCmtBtn} btn-secondary`}>
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.sendCmtBtn} btn-primary ${isPending ? "disabled" : ""}`}>
              {isPending ? "Loading..." : "Send"}
            </button>
          </>
        )}
      </div>

      {formError.content && (
        <p className="error-mgs">{formError.content.message}</p>
      )}
    </form>
  );
}

export default CmtCreateForm;

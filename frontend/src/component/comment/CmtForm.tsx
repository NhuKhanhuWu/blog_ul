/** @format */

import * as yup from "yup";
import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAppSelector } from "../../hook/reduxHooks";
import styles from "../../styles/component/BlogCmt.module.scss";
import defaultAvatar from "../../utils/default-avatar";
import { Dispatch, SetStateAction } from "react";
import { useCreateCmt } from "../../hook/cmt/useCreateCmt";

const formSchema = yup.object().shape({
  content: yup
    .string()
    .max(2000, "Comment must be at most 5000 characters")
    .required(),
});

type TFormSchema = yup.InferType<typeof formSchema>;

interface ICmtForm {
  isUsing: boolean;
  setIsUsing: Dispatch<SetStateAction<boolean>>;
  blogId: string;
  parentId?: string;
}

function CmtForm({ isUsing, setIsUsing, blogId, parentId }: ICmtForm) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // handling form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formError },
  } = useForm({ resolver: yupResolver(formSchema) });

  // handling send create cmt request
  const { mutate, isPending, isError: fetchError } = useCreateCmt();

  const username = useAppSelector((state) => state.auth.user?.name) || "";

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
      { blogId, parentId, content: data.content },
      {
        onSettled: () =>
          // close form after send cmt
          cancelCmt(),
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
        <input
          onFocus={() => setIsUsing(true)}
          {...register("content")}
          placeholder="Write your comment"
          className="input"></input>

        {isUsing && (
          <>
            <button
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

      {fetchError && <p className="error-mgs">Something went wrong.</p>}
    </form>
  );
}

export default CmtForm;

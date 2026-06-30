/** @format */

import * as yup from "yup";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAppSelector } from "../../../hook/shared/reduxHooks";
import styles from "./CmtEditForm.module.scss";
import defaultAvatar from "../../../utils/default-avatar";
import { useCmtItem } from "../../../context/CmtItemContext";
import useEditCmt from "../../../hook/cmt/useEditCmt";

const formSchema = yup.object().shape({
  content: yup
    .string()
    .max(2000, "Comment must be at most 5000 characters")
    .required(),
});

type FormSchemaFields = yup.InferType<typeof formSchema>;

function CmtEditForm() {
  // get cmt context
  const { dispatch } = useCmtItem();
  const { cmt } = useCmtItem().state;
  const initValue: FormSchemaFields = {
    content: cmt.content,
  };

  // get avatar
  const username = useAppSelector((state) => state.auth.user?.name) || "";
  const avatar =
    useAppSelector((state) => state.auth.user?.avatar) ||
    defaultAvatar(username);

  // handle form
  const {
    register,
    handleSubmit,
    formState: { errors: formError },
  } = useForm({ resolver: yupResolver(formSchema), defaultValues: initValue });

  // handling send create cmt request
  const { mutate, isPending } = useEditCmt();

  function submitHandler(data: FormSchemaFields) {
    // send request to server
    mutate(
      { cmtId: cmt._id, content: data.content },
      {
        // close the form
        onSettled: () => {
          dispatch({ type: "SET_IS_EDIT", payload: false });
        },
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
          {...register("content")}
          placeholder="Write your comment"
          className="input"></input>

        {/* action btns */}
        <button
          onClick={() => dispatch({ type: "SET_IS_EDIT", payload: false })}
          className={`${styles.sendCmtBtn} btn-secondary`}>
          Cancel
        </button>
        <button
          type="submit"
          className={`${styles.sendCmtBtn} btn-primary ${isPending ? "disabled" : ""}`}>
          {isPending ? "Loading..." : "Send"}
        </button>
      </div>

      {formError.content && (
        <p className="error-mgs">{formError.content.message}</p>
      )}
    </form>
  );
}

export default CmtEditForm;

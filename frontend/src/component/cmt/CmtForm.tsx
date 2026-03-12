/** @format */

import * as yup from "yup";
import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAppSelector } from "../../hook/reduxHooks";
import styles from "../../styles/component/BlogCmt.module.scss";
import defaultAvatar from "../../utils/defaultAvatar";

const formSchema = yup.object().shape({
  content: yup
    .string()
    .max(2000, "Comment must be at most 5000 characters")
    .required(),
});

type TFormSchema = yup.InferType<typeof formSchema>;

function CmtForm() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) });
  const username = useAppSelector((state) => state.auth.user?.name) || "";
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

  function submitHandler(data: TFormSchema) {}

  return (
    <form onSubmit={handleSubmit(submitHandler)} className={styles.cmtForm}>
      <div className={styles.formInput}>
        <img loading="lazy" alt={username} src={avatar} />
        <input
          {...register("content")}
          placeholder="Write your comment"
          className="input"></input>
        <button className="btn-primary">Send</button>
      </div>

      {errors.content && <p className="error-mgs">{errors.content.message}</p>}
    </form>
  );
}

export default CmtForm;

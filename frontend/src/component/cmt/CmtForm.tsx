/** @format */

import * as yup from "yup";
import { Link } from "react-router-dom";

import { useAppSelector } from "../../hook/reduxHooks";
import styles from "../../styles/component/BlogCmt.module.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const formSchema = yup.object().shape({
  content: yup
    .string()
    .max(2000, "Comment must be at most 5000 characters")
    .required(),
});

function CmtForm() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) });

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

  return (
    <div className={styles.cmtForm}>
      <input placeholder="Write your comment" className="input"></input>
    </div>
  );
}

export default CmtForm;

/** @format */

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";

import styles from "../styles/component/Auth.module.scss";
import { emaiSchema, passwordSchema } from "../utils/formSchema";
import AuthHeader from "../component/Auth/AuthHeader";
import { Email, Password } from "../component/Auth/AuthInputs";
import AuthFooter from "../component/Auth/AuthFooter";
import { useAppDispatch, useAppSelector } from "../hook/reduxHooks";
import { loginThunk } from "../redux/authSlice";

const formSchema = yup.object().shape({
  email: emaiSchema,
  password: passwordSchema,
});

type IFormSchema = yup.InferType<typeof formSchema>;

function Login() {
  const {
    register,
    handleSubmit,
    resetField,
    control,
    formState: { errors: formErrors },
  } = useForm<IFormSchema>({
    resolver: yupResolver(formSchema),
  });

  // handling fetching data
  const { isLoading } = useAppSelector((state) => state.auth);
  const { error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function submitHandler(data: IFormSchema) {
    try {
      await dispatch(
        loginThunk({ email: data.email, password: data.password }),
      ).unwrap();

      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
        <AuthHeader subtitle="Log in to your account" title="Welcome back" />

        {error && <p className="error-mgs">{error}</p>}

        <Email
          control={control}
          errors={formErrors}
          register={register}
          resetField={resetField}
        />
        <Password
          control={control}
          errors={formErrors}
          register={register}
          resetField={resetField}
        />

        <Link className={`link ${styles.forgotPass}`} to="auth/forgot-password">
          Forgot password?
        </Link>

        <button
          type="submit"
          className={`btn-primary ${styles.submitBtn} ${isLoading && ".disabled"}`}>
          Log in
        </button>

        <AuthFooter type="login" />
      </form>
    </div>
  );
}

export default Login;

/** @format */

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";

import { emaiSchema, passwordSchema } from "../../utils/form-schema";
import AuthHeader from "../../component/auth/AuthHeader/AuthHeader";
import AuthFooter from "../../component/auth/AuthFooter/AuthFooter";
import { useAppDispatch, useAppSelector } from "../../hook/shared/reduxHooks";
import { loginThunk } from "../../redux/auth.slice";
import EmailField from "../../component/input/EmailField";
import { PasswordField } from "../../component/input/PasswordField";

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
  const { isLoading, error } = useAppSelector((state) => state.auth);
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
    <form onSubmit={handleSubmit(submitHandler)}>
      <AuthHeader subtitle="Log in to your account" title="Welcome back" />

      {error && <p className="error-mgs">{error}</p>}

      <EmailField
        isLoading={isLoading}
        control={control}
        errors={formErrors}
        register={register}
        resetField={resetField}
      />
      <PasswordField
        isLoading={isLoading}
        control={control}
        errors={formErrors}
        register={register}
        resetField={resetField}
      />

      <Link
        className={`link `}
        style={{ textAlign: "left", width: "100%", fontSize: "1.2rem" }}
        to="auth/forgot-password">
        Forgot password?
      </Link>

      <button
        type="submit"
        className={`btn-primary  ${isLoading && "disabled"}`}>
        Log in
      </button>

      <AuthFooter type="login" />
    </form>
  );
}

export default Login;

/** @format */

import * as yup from "yup";
import { passwordConfirmSchema, passwordSchema } from "../../utils/form-schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthHeader from "../../component/auth/AuthHeader/AuthHeader";
import { PasswordField } from "../../component/input/PasswordField";
import { PasswordConfirmField } from "../../component/input/PasswordConfirmField";
import { useForgotPassword } from "../../context/ForgotPasswordContext";
import useForgotPasswordReset from "../../hook/auth/useForgotPasswordReset";
import ReEnterEmail from "../../component/ui/ReEnterEmail/ReEnterEmail";

const formSchema = yup.object().shape({
  password: passwordSchema,
  passwordConfirm: passwordConfirmSchema,
});

type FormSchemaProps = yup.InferType<typeof formSchema>;

function ForgotPasswordReset() {
  // sign up token
  const { token } = useForgotPassword();

  // form
  const {
    control,
    handleSubmit,
    resetField,
    register,
    formState: { errors: formErr },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  // muation
  const { mutate, isPending, error: queryErr } = useForgotPasswordReset();

  function submitHandler(data: FormSchemaProps) {
    mutate({ ...data, token });
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <AuthHeader
        title="Reset password"
        subtitle="All of your devices will be logged out"
      />

      <ReEnterEmail link="/auth/forgot-password" />

      {/* err message */}
      {queryErr && <p className="error-mgs">{queryErr.message}</p>}

      <PasswordField
        control={control}
        errors={formErr}
        register={register}
        isLoading={isPending}
        resetField={resetField}
      />

      <PasswordConfirmField
        control={control}
        errors={formErr}
        register={register}
        isLoading={isPending}
        resetField={resetField}
      />

      <button
        type="submit"
        className={`btn-primary  ${isPending && "disabled"}`}>
        Submit
      </button>
    </form>
  );
}

export default ForgotPasswordReset;

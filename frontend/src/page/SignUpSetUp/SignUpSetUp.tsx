/** @format */

import * as yup from "yup";
import AuthHeader from "../../component/auth/AuthHeader/AuthHeader";
import { PasswordField } from "../../component/input/PasswordField";
import {
  passwordConfirmSchema,
  passwordSchema,
  usernameSchema,
} from "../../utils/form-schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useSignUpSetupStep from "../../hook/auth/useSignUpSetupStep";
import { PasswordConfirmField } from "../../component/input/PasswordConfirmField";
import { useSignUp } from "../../context/SignUpContext";
import { UsernameField } from "../../component/input/UsernameField";

const formSchema = yup.object().shape({
  username: usernameSchema,
  password: passwordSchema,
  passwordConfirm: passwordConfirmSchema,
});

type FormSchemaProps = yup.InferType<typeof formSchema>;

function SignUpSetUp() {
  // sign up token
  const { token } = useSignUp();

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
  const { mutate, isPending, error: queryErr } = useSignUpSetupStep();

  function submitHandler(data: FormSchemaProps) {
    mutate({ ...data, token });
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <AuthHeader title="Sign up" subtitle="Set up your account" />

      {/* err message */}
      {queryErr && <p className="error-mgs">{queryErr.message}</p>}

      <UsernameField
        control={control}
        errors={formErr}
        register={register}
        resetField={resetField}
      />

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

export default SignUpSetUp;

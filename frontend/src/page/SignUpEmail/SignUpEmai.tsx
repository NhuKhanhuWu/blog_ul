/** @format */

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { emaiSchema } from "../../utils/form-schema";
import AuthHeader from "../../component/auth/AuthHeader/AuthHeader";
import AuthFooter from "../../component/auth/AuthFooter/AuthFooter";
import useSignUpEmailStep from "../../hook/auth/useSignUpEmailStep";
import EmailField from "../../component/input/EmailField.tsx";
import { useNavigate } from "react-router-dom";

const formSchema = yup.object().shape({
  email: emaiSchema,
});

type FormSchemaProps = yup.InferType<typeof formSchema>;

function SignUpEmail() {
  // form
  const {
    register,
    handleSubmit,
    resetField,
    control,
    formState: { errors: formErrors },
  } = useForm<FormSchemaProps>({
    resolver: yupResolver(formSchema),
  });

  // request
  const { mutate, isPending, isError, error } = useSignUpEmailStep();

  // redirect
  const navigate = useNavigate();

  function submitHandler(data: FormSchemaProps) {
    mutate(data.email, {
      onSuccess: () => {
        // move to otp page
        navigate("verify-otp");
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <AuthHeader subtitle="Create a blogie account" title="Join us now" />

      {isError && <p className="error-mgs">{error.message}</p>}

      <EmailField
        isLoading={isPending}
        control={control}
        errors={formErrors}
        register={register}
        resetField={resetField}
      />

      <button
        type="submit"
        className={`btn-primary ${isPending && "disabled"}`}>
        Sign up
      </button>

      <AuthFooter type="signup" />
    </form>
  );
}

export default SignUpEmail;

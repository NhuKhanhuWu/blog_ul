/** @format */

import * as yup from "yup";
import { useSignUp } from "../../context/SignUpContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import OtpInputField from "../../component/input/OtpInput";
import AuthHeader from "../../component/auth/AuthHeader/AuthHeader";
import useSignUpOtpStep from "../../hook/auth/useSignUpOtpStep";
import { createOtpSchema } from "../../utils/form-schema";

const formSchema = yup.object().shape({
  otp: createOtpSchema(),
});

type FormSchemaProps = yup.InferType<typeof formSchema>;

function SignUpOtp() {
  const { email } = useSignUp();

  // query
  const { mutate, isPending, error } = useSignUpOtpStep();

  // form
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(formSchema),
  });

  function submitHandler(data: FormSchemaProps) {
    mutate({ email, otp: data.otp });
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <AuthHeader
        subtitle="Check your mail box for OTP code"
        title="Validate your mail"
      />

      {/* err message */}
      {error && <p className="error-mgs">{error.message}</p>}

      <OtpInputField name="otp" control={control} length={6} />

      <button
        type="submit"
        className={`btn-primary  ${isPending && "disabled"}`}>
        Submit
      </button>
    </form>
  );
}

export default SignUpOtp;

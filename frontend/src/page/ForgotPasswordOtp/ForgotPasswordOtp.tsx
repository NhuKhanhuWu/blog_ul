/** @format */

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useForgotPassword } from "../../context/ForgotPasswordContext";
import useForgotPasswordOtp from "../../hook/auth/useForgotPasswordOtp";
import { yupResolver } from "@hookform/resolvers/yup";
import { createOtpSchema } from "../../utils/form-schema";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../../component/auth/AuthHeader/AuthHeader";
import OtpInputField from "../../component/input/OtpInput";
import ResendOtp from "../../component/auth/ResendOtp/ResendOtp";
import useForgotPasswordEmail from "../../hook/auth/useForgotPasswordEmail";
import ReEnterEmail from "../../component/ui/ReEnterEmail/ReEnterEmail";

const formSchema = yup.object().shape({
  otp: createOtpSchema(),
});

type FormSchemaProps = yup.InferType<typeof formSchema>;

function ForgotPasswordOtp() {
  const { email } = useForgotPassword();
  const { mutate: resendMutate } = useForgotPasswordEmail();

  // query
  const { mutate, isPending, error } = useForgotPasswordOtp();

  // form
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(formSchema),
  });

  // redirect
  const navigate = useNavigate();

  function submitHandler(data: FormSchemaProps) {
    mutate(
      { email, otp: data.otp },
      {
        onSuccess: () => {
          // navigate to reset password page
          navigate("/auth/forgot-password/reset");
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <AuthHeader
        subtitle="Check email for the OTP (takes 10-15s)"
        title="Validate your mail"
      />

      <ReEnterEmail link="/auth/forgot-password" />

      {/* err message */}
      {error && <p className="error-mgs">{error.message}</p>}

      <OtpInputField name="otp" control={control} length={6} />

      <ResendOtp
        email={email}
        mutate={resendMutate}
        resetTime={60}
        isPending={isPending}
      />

      <button
        type="submit"
        className={`btn-primary  ${isPending && "disabled"}`}>
        Submit
      </button>
    </form>
  );
}

export default ForgotPasswordOtp;

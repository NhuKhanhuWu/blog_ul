/** @format */

import * as yup from "yup";
import { useSignUp } from "../../context/SignUpContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import OtpInputField from "../../component/input/OtpInput";
import AuthHeader from "../../component/auth/AuthHeader/AuthHeader";
import useSignUpOtpStep from "../../hook/auth/useSignUpOtpStep";
import { createOtpSchema } from "../../utils/form-schema";
import useSignUpEmailStep from "../../hook/auth/useSignUpEmailStep";
import { useNavigate } from "react-router-dom";
import ResendOtp from "../../component/auth/ResendOtp/ResendOtp";
import ReEnterEmail from "../../component/ui/ReEnterEmail/ReEnterEmail";
import { useState } from "react";
import AttemptsCounter from "../../component/ui/AttemptsCounter/AttemptsCounter";

const formSchema = yup.object().shape({
  otp: createOtpSchema(),
});

type FormSchemaProps = yup.InferType<typeof formSchema>;

function SignUpOtp() {
  const { email } = useSignUp();
  const { mutate: resendMutate } = useSignUpEmailStep();
  const [attemptsLeft, setAttemptsLeft] = useState(5); // no attemps left when === 0

  // query
  const { mutate, isPending, error } = useSignUpOtpStep();

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
          // navigate to password page
          navigate("/auth/signup/setup");
        },

        // reduce attemps when user type wrong otp
        onError: () => {
          setAttemptsLeft((prev) => prev - 1);
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

      <ReEnterEmail link="/auth/signup" />

      {/* api err message */}
      {error && <p className="error-mgs">{error.message}</p>}

      <OtpInputField name="otp" control={control} length={6} />

      <AttemptsCounter attemptsLeft={attemptsLeft} />

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

export default SignUpOtp;

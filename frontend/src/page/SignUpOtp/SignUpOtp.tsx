/** @format */

import * as yup from "yup";
import { useSignUp } from "../../context/SignUpContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import OtpInputField from "../../component/input/OtpInput";
import AuthHeader from "../../component/auth/AuthHeader/AuthHeader";
import useSignUpOtpStep from "../../hook/auth/useSignUpOtpStep";
import { createOtpSchema } from "../../utils/form-schema";
import useCountdown from "../../hook/shared/useCountDown";
import useSignUpEmailStep from "../../hook/auth/useSignUpEmailStep";
import { useNavigate } from "react-router-dom";

const formSchema = yup.object().shape({
  otp: createOtpSchema(),
});

type FormSchemaProps = yup.InferType<typeof formSchema>;

function ReSendOtp() {
  // get email
  const { email } = useSignUp();

  // re-send otp countdown
  const { seconds, reset } = useCountdown(60); // can re-send every 60s

  // mutation handler
  const { mutate } = useSignUpEmailStep();

  function handleSendEmail() {
    mutate(email, {
      onSuccess: () => {
        reset(60);
      },
    });
  }

  // style
  const style: React.CSSProperties = {
    fontWeight: 600,
    fontStyle: "italic",
    textDecoration: "underline",
    // pointerEvents: seconds > 0 ? "none" : "auto",
    cursor: seconds > 0 ? "not-allowed" : "pointer",
    color: seconds > 0 ? "var(--text-muted)" : "var(--accent-color)",
  };

  // disabled-txt
  return (
    <p>
      Didn't receive our mail?{" "}
      <span className="btn" onClick={() => handleSendEmail()} style={style}>
        Send again ({seconds}s)
      </span>
    </p>
  );
}

function SignUpOtp() {
  const { email } = useSignUp();

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
          navigate("/auth/signup/setup-password");
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

      {/* err message */}
      {error && <p className="error-mgs">{error.message}</p>}

      <OtpInputField name="otp" control={control} length={6} />

      <ReSendOtp />

      <button
        type="submit"
        className={`btn-primary  ${isPending && "disabled"}`}>
        Submit
      </button>
    </form>
  );
}

export default SignUpOtp;

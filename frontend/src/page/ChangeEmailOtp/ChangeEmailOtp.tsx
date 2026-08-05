/** @format */
import * as yup from "yup";
import { useForm } from "react-hook-form";
import useChangeEmailOtp from "../../hook/user/useChangeEmailOtp";
import { createOtpSchema } from "../../utils/form-schema";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { useState } from "react";
import styles from "../../styles/form-page.module.scss";
import OtpInputField from "../../component/input/OtpInput";
import ResendOtp from "../../component/auth/ResendOtp/ResendOtp";
import { useChangeEmail } from "../../context/ChangeEmailContext";
import useChangeEmailPassword from "../../hook/user/useChangeEmailPassword";
import AttemptsCounter from "../../component/ui/AttemptsCounter/AttemptsCounter";
import ReEnterEmail from "../../component/ui/ReEnterEmail/ReEnterEmail";
import { useNavigate } from "react-router-dom";

const formSchema = yup.object().shape({
  otp: createOtpSchema(),
});

type FormSchemaProps = yup.InferType<typeof formSchema>;

function ChangeEmailOtp() {
  const { newEmail, password } = useChangeEmail();
  const { mutate: resendMutate, isPending: resendIsPending } =
    useChangeEmailPassword();
  const navigate = useNavigate();

  // request handler
  const { mutate, isPending, error } = useChangeEmailOtp();

  // form handler
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(formSchema),
  });
  const [attemptsLeft, setAttemptsLeft] = useState(5); // no attemps left when === 0

  function submitHandler(data: FormSchemaProps) {
    mutate(Number(data.otp), {
      onSuccess: () => {
        // show toats message
        toast.success("Email updated");

        // go back to change email page
        navigate("/account/setting/email");
      },

      // reduce attemps when user type wrong otp
      onError: () => {
        setAttemptsLeft((prev) => prev - 1);
      },
    });
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Verify New Email</h1>
        <p className={styles.subtitle}>We sent 6-digits code to {newEmail}</p>
      </header>

      {/* err message */}
      {error && <p className="error-mgs">{error.message}</p>}

      <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
        <ReEnterEmail link="/account/setting/email" />

        <div style={{ margin: "auto" }}>
          <OtpInputField name="otp" control={control} length={6} />
        </div>

        <div>
          <ResendOtp
            payload={{ password, newEmail }}
            mutate={resendMutate}
            resetTime={60}
            isPending={resendIsPending}
          />

          <AttemptsCounter attemptsLeft={attemptsLeft} />
        </div>

        <button
          type="submit"
          className={`btn-primary ${styles.submitBtn} ${(isPending || resendIsPending) && "disabled"}`}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default ChangeEmailOtp;

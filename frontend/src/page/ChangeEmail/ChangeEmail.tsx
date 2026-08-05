/** @format */

import styles from "../../styles/form-page.module.scss";
import * as yup from "yup";
import { emaiSchema, passwordSchema } from "../../utils/form-schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PasswordField } from "../../component/input/PasswordField";
import EmailField from "../../component/input/EmailField";
import useChangeEmailPassword from "../../hook/user/useChangeEmailPassword";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const formSchema = yup.object({
  password: passwordSchema,
  newEmail: emaiSchema,
});

type FormSchemaProps = yup.InferType<typeof formSchema>;

function ChangeEmailForm() {
  // handle form
  const {
    register,
    handleSubmit,
    control,
    resetField,
    formState: { errors: formError },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  // handle request
  const { mutate, isPending, error: queryError } = useChangeEmailPassword();

  // redirect to next step (otp)
  const navigate = useNavigate();

  function submitHandler(data: FormSchemaProps) {
    mutate(data, {
      onSuccess: () => {
        toast.success("Password updated");

        // redirect to otp page
        navigate("verify-otp");
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
      {/* error mgs */}
      {queryError && <p className="error-mgs">{queryError.message}</p>}

      {/* account's password */}
      <div className={styles.inputGroup}>
        <label
          htmlFor="password"
          className={`${styles.label} ${isPending && styles.disabled}`}>
          Password
        </label>
        <PasswordField
          control={control}
          errors={formError}
          register={register}
          resetField={resetField}
          isLoading={isPending}
        />
      </div>

      {/* new email */}
      <div className={styles.inputGroup}>
        <label
          htmlFor="newEmail"
          className={`${styles.label} ${isPending && styles.disabled}`}>
          New Email
        </label>
        <EmailField
          control={control}
          errors={formError}
          register={register}
          resetField={resetField}
          isLoading={isPending}
          fieldName="newEmail"
        />
      </div>

      {/* submit btn */}
      <button
        type="submit"
        className={`btn-primary ${styles.submitBtn} ${isPending && "disabled"}`}>
        Submit
      </button>
    </form>
  );
}

function ChangeEmail() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Change Email</h1>
        <p className={styles.subtitle}>
          Update your email address to keep your account secure.
        </p>
        <p className={styles.subtitle}>
          *Your account will be logged out in others device.
        </p>
      </header>

      <ChangeEmailForm />
    </div>
  );
}

export default ChangeEmail;

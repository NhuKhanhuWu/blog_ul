/** @format */

import * as yup from "yup";

import styles from "./ChangePassword.module.scss";
import { PasswordField } from "../../component/input/PasswordField";
import {
  basePasswordSchema,
  passwordConfirmSchema,
  passwordSchema,
} from "../../utils/form-schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PasswordConfirmField } from "../../component/input/PasswordConfirmField";
import useChangePassword from "../../hook/user/useChangePassword";
import toast from "react-hot-toast";

const formSchema = yup.object().shape({
  currentPassword: basePasswordSchema.required("Current password required"),
  password: passwordSchema.notOneOf(
    [yup.ref("currentPassword")],
    "New password cannot be the same as your current password",
  ),
  passwordConfirm: passwordConfirmSchema,
  isLogoutOthers: yup.boolean().required().default(true),
});

type formSchemaArgs = yup.InferType<typeof formSchema>;

// TODO: change password here
function ChangePassForm() {
  const {
    register,
    control,
    resetField,
    handleSubmit,
    formState: { errors: formErr },
    reset,
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      isLogoutOthers: true, // Initialize as false instead of undefined
    },
  });

  // hanle request
  const { mutate, isPending, error: queryError } = useChangePassword();

  function submitHandler(data: formSchemaArgs) {
    mutate(data, {
      onSuccess: () => {
        toast.success("Password updated");

        reset();
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
      {/* error mgs */}
      {queryError && <p className="error-mgs">{queryError.message}</p>}

      {/* Current Password */}
      <div className={styles.inputGroup}>
        <label
          htmlFor="currentPassword"
          className={`${styles.label} ${isPending && styles.disabled}`}>
          Current Password
        </label>
        <PasswordField
          control={control}
          register={register}
          resetField={resetField}
          errors={formErr}
          fieldName="currentPassword"
        />
      </div>

      {/* New Password */}
      <div className={styles.inputGroup}>
        <label className={`${styles.label} ${isPending && styles.disabled}`}>
          New Password
        </label>
        <PasswordField
          control={control}
          register={register}
          resetField={resetField}
          errors={formErr}
          // fieldName="password"
        />
      </div>

      {/* Confirm New Password */}
      <div className={styles.inputGroup}>
        <label
          htmlFor="confirmPassword"
          className={`${styles.label} ${isPending && styles.disabled}`}>
          Confirm New Password
        </label>
        <PasswordConfirmField
          control={control}
          errors={formErr}
          register={register}
          resetField={resetField}
          isLoading={isPending}
        />
      </div>

      {/* option to log out of others devices*/}
      <div className="checkbox">
        <input
          type="checkbox"
          id="isLogoutOthers"
          {...register("isLogoutOthers")}
          disabled={isPending}
        />
        <label
          htmlFor="isLogoutOthers"
          className={`${styles.label} ${isPending && styles.disabled}`}>
          Log out of all other devices
        </label>
      </div>

      {/* Submit Button */}
      <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
        Update Password
      </button>
    </form>
  );
}

function ChangePassword() {
  // handle form

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Change Password</h1>
        <p className={styles.subtitle}>
          Choose a strong password and keep your account secure.
          <br />
          Avoid using personal information or common words.
        </p>
      </header>

      <ChangePassForm />
    </div>
  );
}

export default ChangePassword;

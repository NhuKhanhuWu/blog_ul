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

const formSchema = yup.object().shape({
  currentPassword: basePasswordSchema.required("Current password required"),
  password: passwordSchema.notOneOf(
    [yup.ref("currentPassword")],
    "New password cannot be the same as your current password",
  ),
  passwordConfirm: passwordConfirmSchema,
});

type formSchemaArgs = yup.InferType<typeof formSchema>;

// TODO: change password here
function ChangePassword() {
  const {
    register,
    control,
    resetField,
    handleSubmit,
    formState: { errors: formErr },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  function submitHandler(data: formSchemaArgs) {
    console.log(data);
  }
  console.log(formErr);

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

      <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
        {/* Current Password */}
        <div className={styles.inputGroup}>
          <label htmlFor="currentPassword" className={styles.label}>
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
          <label className={styles.label}>New Password</label>
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
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm New Password
          </label>
          <PasswordConfirmField
            control={control}
            errors={formErr}
            register={register}
            resetField={resetField}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className={styles.submitBtn}>
          Update Password
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;

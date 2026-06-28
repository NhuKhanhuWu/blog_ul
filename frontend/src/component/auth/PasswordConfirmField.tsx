/** @format */

import { useWatch, FieldValues } from "react-hook-form";

import { MdPassword } from "react-icons/md";
import { GoXCircleFill } from "react-icons/go";
import styles from "./AuthInput.module.scss";
import { Path } from "react-hook-form";
import { Props } from "../../types/auth.type";

export function PasswordConfirmField<T extends FieldValues>({
  register,
  control,
  resetField,
  errors,
  isLoading,
}: Props<T>) {
  const passwordValue = useWatch({
    control,
    name: "passwordConfirm" as Path<T>,
  });

  return (
    <div className={styles.inputContainer}>
      <div className={`input ${isLoading && styles.disabled}`}>
        <MdPassword className={styles.icon} />

        <input
          {...register("passwordConfirm" as Path<T>)}
          placeholder="*Confirm password"
        />

        {passwordValue && (
          <GoXCircleFill
            className="btn-reset--input"
            onClick={() => resetField("passwordConfirm" as Path<T>)}
          />
        )}
      </div>

      {errors.passwordConfirm && (
        <p className="error-mgs">*{String(errors.passwordConfirm.message)}</p>
      )}
    </div>
  );
}

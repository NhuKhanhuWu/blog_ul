/** @format */

import { useWatch, FieldValues } from "react-hook-form";

import { MdPassword } from "react-icons/md";
import { GoXCircleFill } from "react-icons/go";
import styles from "./Input.module.scss";
import { Path } from "react-hook-form";
import { Props } from "../../types/auth.type";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

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
  const [isShowPass, setIsShowPass] = useState(false);

  return (
    <div className={styles.inputContainer}>
      <div className={`input ${isLoading && styles.disabled}`}>
        <MdPassword className={styles.icon} />

        <input
          {...register("passwordConfirm" as Path<T>)}
          placeholder="*Confirm password"
          type={isShowPass ? "text" : "password"}
        />

        {/* show/hide pass btn */}
        {passwordValue &&
          (isShowPass ? (
            <FaRegEyeSlash
              className="btn-reset--input"
              onClick={() => setIsShowPass(!isShowPass)}
            />
          ) : (
            <FaRegEye
              className="btn-reset--input"
              onClick={() => setIsShowPass(!isShowPass)}
            />
          ))}

        {/* clear field */}
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

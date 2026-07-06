/** @format */

import { useWatch, FieldValues } from "react-hook-form";

import { MdPassword } from "react-icons/md";
import { GoXCircleFill } from "react-icons/go";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import styles from "./Input.module.scss";
import { Path } from "react-hook-form";
import { useState } from "react";
import { Props } from "../../types/auth.type";

export function PasswordField<T extends FieldValues>({
  register,
  control,
  resetField,
  errors,
  isLoading,
  fieldName = "password",
}: Props<T>) {
  const passwordValue = useWatch({ control, name: fieldName as Path<T> });
  const [isShowPass, setIsShowPass] = useState(false);

  return (
    <div className={styles.inputContainer}>
      <div className={`input ${isLoading && styles.disabled}`}>
        <MdPassword className={styles.icon} />

        <input
          {...register(fieldName as Path<T>)}
          placeholder="*Password"
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
            onClick={() => resetField(fieldName as Path<T>)}
          />
        )}
      </div>

      {errors[fieldName] && (
        <p className="error-mgs">*{String(errors[fieldName]?.message)}</p>
      )}
    </div>
  );
}

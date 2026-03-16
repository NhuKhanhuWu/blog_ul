/** @format */

import {
  useWatch,
  Control,
  UseFormRegister,
  UseFormResetField,
  FieldErrors,
  FieldValues,
} from "react-hook-form";
import { IoMailOutline } from "react-icons/io5";
import { MdPassword } from "react-icons/md";
import { GoXCircleFill } from "react-icons/go";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import styles from "../../styles/component/Auth.module.scss";
import { Path } from "react-hook-form";
import { useState } from "react";

interface Props<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  resetField: UseFormResetField<T>;
  errors: FieldErrors<T>;
}

export function Email<T extends FieldValues>({
  register,
  resetField,
  control,
  errors,
}: Props<T>) {
  const emailValue = useWatch({ control, name: "email" as Path<T> });

  return (
    <div className={styles.inputContainer}>
      <div className="input">
        <IoMailOutline className={styles.icon} />

        <input {...register("email" as Path<T>)} placeholder="*Email" />

        {emailValue && (
          <GoXCircleFill
            className="btn-reset--input"
            onClick={() => resetField("email" as Path<T>)}
          />
        )}
      </div>

      {errors.email && (
        <p className="error-mgs">*{String(errors.email.message)}</p>
      )}
    </div>
  );
}

export function Password<T extends FieldValues>({
  register,
  control,
  resetField,
  errors,
}: Props<T>) {
  const passwordValue = useWatch({ control, name: "password" as Path<T> });
  const [isShowPass, setIsShowPass] = useState(false);

  return (
    <div className={styles.inputContainer}>
      <div className="input">
        <MdPassword className={styles.icon} />

        <input
          {...register("password" as Path<T>)}
          placeholder="*Password"
          type={isShowPass ? "text" : "password"}
        />

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

        {passwordValue && (
          <GoXCircleFill
            className="btn-reset--input"
            onClick={() => resetField("password" as Path<T>)}
          />
        )}
      </div>

      {errors.password && (
        <p className="error-mgs">*{String(errors.password.message)}</p>
      )}
    </div>
  );
}

export function PasswordConfirm<T extends FieldValues>({
  register,
  control,
  resetField,
  errors,
}: Props<T>) {
  const passwordValue = useWatch({
    control,
    name: "passwordConfirm" as Path<T>,
  });

  return (
    <div className={styles.inputContainer}>
      <div className="input">
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

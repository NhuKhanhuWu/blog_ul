/** @format */

import { FieldValues, Path, useWatch } from "react-hook-form";
import { Props } from "../../types/auth.type";
import { IoMailOutline } from "react-icons/io5";
import { GoXCircleFill } from "react-icons/go";
import styles from "./Input.module.scss";

function EmailField<T extends FieldValues>({
  register,
  resetField,
  control,
  errors,
  isLoading,
}: Props<T>) {
  const emailValue = useWatch({ control, name: "email" as Path<T> });

  return (
    <div className={styles.inputContainer}>
      <div className={`input ${isLoading && styles.disabled}`}>
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

export default EmailField;

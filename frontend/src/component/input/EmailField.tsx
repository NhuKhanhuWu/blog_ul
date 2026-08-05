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
  fieldName = "email",
}: Props<T>) {
  const emailValue = useWatch({ control, name: fieldName as Path<T> });

  return (
    <div className={styles.inputContainer}>
      <div className={`input ${isLoading && styles.disabled}`}>
        <IoMailOutline className={styles.icon} />

        <input {...register(fieldName as Path<T>)} placeholder="*Email" />

        {emailValue && (
          <GoXCircleFill
            className="btn-reset--input"
            onClick={() => resetField(fieldName as Path<T>)}
          />
        )}
      </div>

      {errors[fieldName] && (
        <p className="error-mgs">*{String(errors[fieldName].message)}</p>
      )}
    </div>
  );
}

export default EmailField;

/** @format */

import { useWatch, FieldValues } from "react-hook-form";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { GoXCircleFill } from "react-icons/go";
import { Path } from "react-hook-form";
import { Props } from "../../types/auth.type";
import styles from "./Input.module.scss";

export function UsernameField<T extends FieldValues>({
  register,
  control,
  resetField,
  errors,
  isLoading,
}: Props<T>) {
  const value = useWatch({ control, name: "username" as Path<T> });

  return (
    <div className={styles.inputContainer}>
      <div className={`input ${isLoading && styles.disabled}`}>
        <MdDriveFileRenameOutline className={styles.icon} />

        <input {...register("username" as Path<T>)} placeholder="*Username" />

        {/* clear field */}
        {value && (
          <GoXCircleFill
            className="btn-reset--input"
            onClick={() => resetField("username" as Path<T>)}
          />
        )}
      </div>

      {errors.username && (
        <p className="error-mgs">*{String(errors.username.message)}</p>
      )}
    </div>
  );
}

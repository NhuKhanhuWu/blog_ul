/** @format */
// import { formatDate } from "../../../utils/date";
import { UseFormRegister } from "react-hook-form";
import styles from "./UpdateProfileForm.module.scss";
import { useAppSelector } from "../../../hook/shared/reduxHooks";
import { formatDate } from "../../../utils/date";

interface ProfileFormValues {
  username: string;
}

interface ProfileFormFieldsProps {
  register: UseFormRegister<ProfileFormValues>;
}

function canUpdateUsername(
  lastNameUpdate: Date | string | null | undefined,
): boolean {
  // If it has never been updated (null/undefined), allow the change immediately.
  if (!lastNameUpdate) return true;

  const now = new Date().getTime();
  const lastUpdate = new Date(lastNameUpdate).getTime();
  const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

  // Returns true if more than 7 days have passed since the last update.
  return now - lastUpdate >= SEVEN_DAYS_IN_MS;
}

export const ProfileFormFields = ({ register }: ProfileFormFieldsProps) => {
  const lastNameUpdate = useAppSelector(
    (state) => state.auth.user,
  )?.usernameLastUpdated;
  const canUpdateName = canUpdateUsername(lastNameUpdate);
  console.log(canUpdateName);

  return (
    <div className={styles.formGroup}>
      <input
        id="profile-name"
        type="text"
        {...register("username")}
        className="input"
        placeholder="Enter your name"
        disabled={!canUpdateName}
      />

      <p className="helperText">
        You can change your nickname once every 7 days.{" "}
        {lastNameUpdate && (
          <p>
            Last update:
            <span> {formatDate(lastNameUpdate)}</span>
          </p>
        )}
      </p>
    </div>
  );
};

/** @format */
import styles from "./EditProfileForm.module.scss";

interface ProfileFormFieldsProps {
  username: string;
  onUsernameChange: (value: string) => void;
}

export const ProfileFormFields = ({
  username,
  onUsernameChange,
}: ProfileFormFieldsProps) => {
  return (
    <div className={styles.formGroup}>
      <input
        id="profile-name"
        type="text"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        className="input"
        placeholder="Enter your name"
      />
      <p className="helperText">
        You can change your nickname once every 7 days.
      </p>
    </div>
  );
};

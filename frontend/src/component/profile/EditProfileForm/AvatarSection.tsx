/** @format */
import { ChangeEvent, RefObject } from "react";
import { LuPencil } from "react-icons/lu";
import styles from "./EditProfileForm.module.scss";

interface AvatarSectionProps {
  displayedAvatar: string;
  fileInputRef: RefObject<HTMLInputElement>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const AvatarSection = ({
  displayedAvatar,
  fileInputRef,
  onFileChange,
}: AvatarSectionProps) => {
  return (
    <div className={styles.avatarWrapper}>
      <div className={styles.avatarContainer}>
        <div className={styles.avatar}>
          <img src={displayedAvatar} alt="Profile avatar" />
        </div>

        {/* Trigger hidden file input */}
        <button
          type="button"
          className={styles.avatarEditButton}
          aria-label="Change avatar"
          onClick={() => fileInputRef.current?.click()}>
          <LuPencil />
        </button>

        <input
          ref={fileInputRef}
          className={styles.fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onFileChange}
        />
      </div>
      <p className="helperText">Supported formats: jpeg, png, webp</p>
    </div>
  );
};

export default AvatarSection;

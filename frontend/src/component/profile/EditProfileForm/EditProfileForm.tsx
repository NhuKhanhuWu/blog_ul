/** @format */
import { Dispatch, SetStateAction } from "react";
import { IoClose } from "react-icons/io5";
import CropAvatarModal from "./CropAvatarModal";
import { useEditProfile } from "../../../hook/user/useEditProfile";
import styles from "./EditProfileForm.module.scss";
import AvatarSection from "./AvatarSection";
import { ProfileFormFields } from "./ProfileFormFields";

interface EditProfileModalProps {
  avatarUrl?: string;
  name?: string;
  handleCloseForm: Dispatch<SetStateAction<boolean>>;
}

const EditProfileForm = ({
  avatarUrl = "/default-avatar.png",
  name = "",
  handleCloseForm,
}: EditProfileModalProps) => {
  // Custom hook containing all states and business logic
  const {
    fileInputRef,
    username,
    setUsername,
    displayedAvatar,
    cropImageUrl,
    hasChanges,
    handleFileChange,
    handleCropSubmit,
    clearCropImageUrl,
    handleSubmit,
  } = useEditProfile({
    initialName: name,
    initialAvatar: avatarUrl,
    onClose: handleCloseForm,
  });

  return (
    <>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title">
        {/* Modal Header */}
        <header className={styles.header}>
          <h2 id="edit-profile-title">Edit profile</h2>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close"
            onClick={() => handleCloseForm(false)}>
            <IoClose />
          </button>
        </header>

        {/* Modal Content / Form Body */}
        <div className={styles.content}>
          <AvatarSection
            displayedAvatar={displayedAvatar}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
          />

          <ProfileFormFields
            username={username}
            onUsernameChange={setUsername}
          />
        </div>

        {/* Modal Footer / Actions */}
        <footer className={styles.footer}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleCloseForm(false)}>
            Cancel
          </button>

          <button
            type="button"
            className="btn-primary"
            disabled={!hasChanges}
            onClick={handleSubmit}>
            Save
          </button>
        </footer>
      </section>

      {/* Image Cropping Modal Pop-up */}
      {cropImageUrl && (
        <CropAvatarModal
          imageUrl={cropImageUrl}
          onCancel={clearCropImageUrl}
          onSubmit={handleCropSubmit}
        />
      )}
    </>
  );
};

export default EditProfileForm;

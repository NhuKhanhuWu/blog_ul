/** @format */
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { Area } from "react-easy-crop";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useObjectUrl } from "../shared/useObjectUrl";
import useUpdateAccount from "./useUpdateAccount";
import useUploadAvatar from "./useUploadAvatar";
import { useAppDispatch } from "../shared/reduxHooks";
import { getCroppedImg } from "../../utils/imageCrop";
import { getMeThunk } from "../../redux/auth.slice";

interface UseEditProfileProps {
  initialName?: string;
  initialAvatar?: string;
  onClose: Dispatch<SetStateAction<boolean>>;
}

interface ProfileFormValues {
  username: string;
}

export const useEditProfile = ({
  initialName = "",
  initialAvatar = "/default-avatar.png",
  onClose,
}: UseEditProfileProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit: submitForm,
    watch,
  } = useForm<ProfileFormValues>({
    defaultValues: { username: initialName },
  });

  // API mutations hooks
  const { mutateAsync: uploadAvatar } = useUploadAvatar();
  const { mutateAsync: updateAccount } = useUpdateAccount();

  // Object URL handlers for preview and cropping
  const { url: avatarPreview, createUrl: setAvatarPreview } = useObjectUrl();
  const {
    url: cropImageUrl,
    createUrl: setCropImageUrl,
    clearUrl: clearCropImageUrl,
  } = useObjectUrl();

  // Handle file selection from local device
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // Reset input to allow selecting the same file again

    if (!file || !file.type.startsWith("image/")) return;
    setCropImageUrl(file);
  };

  // Handle cropping completion and generate a preview file
  const handleCropSubmit = async (area: Area) => {
    if (!cropImageUrl) return;

    try {
      const croppedBlob = await getCroppedImg(cropImageUrl, area);
      if (croppedBlob) {
        const file = new File([croppedBlob], `avatar-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        setAvatarFile(file);
        setAvatarPreview(croppedBlob);
      }
    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      clearCropImageUrl();
    }
  };

  // Form change validations
  const trimmedUsername = watch("username").trim();
  const hasUsernameChange = trimmedUsername !== initialName;
  const hasChanges = hasUsernameChange || avatarFile !== null;
  const displayedAvatar = avatarPreview || initialAvatar;

  // Handle background submit (non-blocking UX)
  const handleSubmit = submitForm(async () => {
    if (!hasChanges) return;

    // Instantly close the modal to let users continue browsing
    onClose(false);
    const toastId = toast.loading("Updating profile...");

    try {
      let uploadedAvatarUrl: string | undefined;

      // Upload avatar to cloud storage if a new file was chosen
      if (avatarFile) {
        uploadedAvatarUrl = await uploadAvatar(avatarFile);
      }

      // Update account details on the server
      await updateAccount({
        ...(hasUsernameChange && { username: trimmedUsername }),
        ...(uploadedAvatarUrl && { avatar: uploadedAvatarUrl }),
      });

      // Refresh global user state via Redux
      await dispatch(getMeThunk());

      toast.success("Profile updated successfully!", { id: toastId });
    } catch {
      toast.error("Failed to update profile. Please try again.", {
        id: toastId,
      });
    }
  });

  return {
    fileInputRef,
    register,
    displayedAvatar,
    cropImageUrl,
    hasChanges,
    handleFileChange,
    handleCropSubmit,
    clearCropImageUrl,
    handleSubmit,
  };
};

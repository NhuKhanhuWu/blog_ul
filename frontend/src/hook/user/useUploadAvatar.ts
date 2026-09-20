/** @format */

import { useMutation } from "@tanstack/react-query";
import { uploadAvatar } from "../../api/user.api";

function useUploadAvatar() {
  return useMutation({
    mutationFn: uploadAvatar,
  });
}

export default useUploadAvatar;

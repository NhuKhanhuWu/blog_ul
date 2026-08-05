/** @format */

import { useMutation } from "@tanstack/react-query";
import { changeEmail } from "../../api/user.api";
import { useChangeEmail } from "../../context/ChangeEmailContext";

function useChangeEmailPassword() {
  const { setFields } = useChangeEmail();

  return useMutation({
    mutationFn: changeEmail,

    // show error message in form
    meta: {
      disableToast: true,
    },

    onSuccess: (_reponse, input) => {
      setFields({
        isPasswordVerified: true,
        newEmail: input.newEmail,
        password: input.password,
      });
    },
  });
}

export default useChangeEmailPassword;

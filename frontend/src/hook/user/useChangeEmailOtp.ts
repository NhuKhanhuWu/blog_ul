/** @format */

import { useMutation } from "@tanstack/react-query";
import { changeEmailOtp } from "../../api/user.api";
import { useChangeEmail } from "../../context/ChangeEmailContext";
import { store } from "../../redux/store";
import { setAccessToken } from "../../redux/auth.slice";

function useChangeEmailOtp() {
  const { resetChangeEmailState } = useChangeEmail();

  return useMutation({
    mutationFn: changeEmailOtp,

    // show error message in form
    meta: {
      disableToast: true,
    },

    onSuccess: (response) => {
      // remove change email state
      resetChangeEmailState();

      // set new acces token
      store.dispatch(setAccessToken(response.accessToken));
    },
  });
}

export default useChangeEmailOtp;

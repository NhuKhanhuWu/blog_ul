/** @format */

import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../api/user.api";
import { store } from "../../redux/store";
import { setAccessToken } from "../../redux/auth.slice";

function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,

    // show error message in form
    meta: {
      disableToast: true,
    },

    onSuccess: (response) => {
      // update auth's slide access token
      store.dispatch(setAccessToken(response.accessToken));
    },
  });
}

export default useChangePassword;

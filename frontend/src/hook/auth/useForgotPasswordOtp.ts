/** @format */

import { useMutation } from "@tanstack/react-query";
import { forgotPasswordOtp } from "../../api/auth.api";
import { useForgotPassword } from "../../context/ForgotPasswordContext";

function useForgotPasswordOtp() {
  const { setFields } = useForgotPassword();

  return useMutation({
    mutationFn: forgotPasswordOtp,
    meta: {
      disableToast: true,
    },
    onSuccess: (response) => {
      // save verify token and mark OTP as verified
      console.log(response);
      setFields({ token: response.token, isOtpVerified: true });
    },
  });
}

export default useForgotPasswordOtp;

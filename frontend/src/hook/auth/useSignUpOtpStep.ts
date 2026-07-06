/** @format */

import { useMutation } from "@tanstack/react-query";
import { signUpOtpStep } from "../../api/auth.api";
import { useSignUp } from "../../context/SignUpContext";

function useSignUpOtpStep() {
  const { setFields } = useSignUp();

  return useMutation({
    mutationFn: signUpOtpStep,
    meta: {
      disableToast: true,
    },
    onSuccess: (response) => {
      // set context variable
      setFields({ isOtpVerified: true, token: response.token });
    },
  });
}

export default useSignUpOtpStep;

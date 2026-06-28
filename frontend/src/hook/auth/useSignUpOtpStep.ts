/** @format */

import { useMutation } from "@tanstack/react-query";
import { signUpOtpStep } from "../../api/auth.api";
import { useSignUp } from "../../context/SignUpContext";
import { useNavigate } from "react-router-dom";

function useSignUpOtpStep() {
  const { setFields } = useSignUp();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signUpOtpStep,
    meta: {
      disableToast: true,
    },
    onSuccess: (response) => {
      // set context variable
      setFields({ isOtpVerified: true });
      setFields({ token: response.token });

      // navigate to password page
      navigate("/auth/signup/setup-password");
    },
  });
}

export default useSignUpOtpStep;

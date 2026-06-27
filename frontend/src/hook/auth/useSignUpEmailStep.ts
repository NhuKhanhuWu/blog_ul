/** @format */

import { useMutation } from "@tanstack/react-query";
import { signUpEmailStep } from "../../api/auth.api";
import { useSignUp } from "../../context/SignUpContext";
import { useNavigate } from "react-router-dom";

function useSignUpEmailStep() {
  const { setEmail } = useSignUp();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signUpEmailStep,

    meta: {
      disableToast: true,
    },

    onSuccess: (_response, data) => {
      // set email on sign context
      setEmail(data);

      // move to otp page
      navigate("verify-otp");
    },
  });
}

export default useSignUpEmailStep;

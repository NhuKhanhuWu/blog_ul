/** @format */

import { useMutation } from "@tanstack/react-query";
import { signUpEmailStep } from "../../api/auth.api";
import { useSignUp } from "../../context/SignUpContext";

function useSignUpEmailStep() {
  const { setFields } = useSignUp();

  return useMutation({
    mutationFn: signUpEmailStep,

    meta: {
      disableToast: true,
    },

    onSuccess: (_response, data) => {
      // set email on sign context
      setFields({ email: data });
    },
  });
}

export default useSignUpEmailStep;

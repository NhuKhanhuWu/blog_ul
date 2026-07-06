/** @format */

import { useMutation } from "@tanstack/react-query";
import { signUpPasswordStep } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function useSignUpPasswordStep() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signUpPasswordStep,
    meta: {
      disableToast: true,
    },
    onSuccess: () => {
      // toast message
      toast.success("Account created");

      // redirect to login page
      navigate("/auth/login");
    },
  });
}

export default useSignUpPasswordStep;

/** @format */

import { useMutation } from "@tanstack/react-query";
import { signUpSetupStep } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function useSignUpSetupStep() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signUpSetupStep,
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

export default useSignUpSetupStep;

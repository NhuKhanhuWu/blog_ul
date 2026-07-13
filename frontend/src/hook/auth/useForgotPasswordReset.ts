/** @format */

import { useMutation } from "@tanstack/react-query";
import { forgotPasswordReset } from "../../api/auth.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function useForgotPasswordReset() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: forgotPasswordReset,
    meta: {
      disableToast: true,
    },
    onSuccess: () => {
      // toast message
      toast.success("Password reset");

      // redirect to login page
      navigate("/auth/login");
    },
  });
}

export default useForgotPasswordReset;

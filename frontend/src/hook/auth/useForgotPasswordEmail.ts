/** @format */

import { useMutation } from "@tanstack/react-query";
import { forgotPasswordEmail } from "../../api/auth.api";
import { useForgotPassword } from "../../context/ForgotPasswordContext";

function useForgotPasswordEmail() {
  const { setFields } = useForgotPassword();

  return useMutation({
    mutationFn: forgotPasswordEmail,
    meta: {
      disableToast: true,
    },
    onSuccess: (_response, data) => {
      setFields({ email: data }); // set email in context's state
    },
  });
}

export default useForgotPasswordEmail;

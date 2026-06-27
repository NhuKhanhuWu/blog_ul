/** @format */

import { useNavigate } from "react-router-dom";
import { useSignUp } from "../../context/SignUpContext";

function SignUpOtp() {
  const { email } = useSignUp();
  const navigate = useNavigate();

  if (!email) {
    navigate("/");
  }

  return <>{email}</>;
}

export default SignUpOtp;

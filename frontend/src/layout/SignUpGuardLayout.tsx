/** @format */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSignUp } from "../context/SignUpContext";

export default function SignUpGuardLayout() {
  const { email, isOtpVerified } = useSignUp();
  const location = useLocation();

  // 1. if !email -> back to email page
  if (
    (location.pathname.includes("verify-otp") ||
      location.pathname.includes("setup-password")) &&
    !email
  ) {
    return <Navigate to="/auth/signup" replace />;
  }

  // 2. if page==="Password" && !password -> back to OTP page
  if (location.pathname.includes("setup-password") && !isOtpVerified) {
    return <Navigate to="/auth/signup/verify-otp" replace />;
  }

  return <Outlet />;
}

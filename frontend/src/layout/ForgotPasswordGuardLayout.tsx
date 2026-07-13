/** @format */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useForgotPassword } from "../context/ForgotPasswordContext";

export default function ForgotPasswordGuardLayout() {
  const { email, isOtpVerified } = useForgotPassword();
  const location = useLocation();

  // 1. if !email -> back to email page
  if (
    (location.pathname.includes("verify-otp") ||
      location.pathname.includes("reset")) &&
    !email
  ) {
    return <Navigate to="/auth/forgot-password" replace />;
  }

  // 2. if page==="reset" && !password -> back to OTP page
  if (location.pathname.includes("reset") && !isOtpVerified) {
    return <Navigate to="/auth/forgot-password/verify-otp" replace />;
  }

  return <Outlet />;
}

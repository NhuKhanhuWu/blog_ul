/** @format */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import FlowStepper from "../component/shared/FlowStepper/FlowStepper";
import { useForgotPassword } from "../context/ForgotPasswordContext";

export default function ForgotPasswordGuardLayout() {
  const { email, isOtpVerified } = useForgotPassword();
  const location = useLocation();

  const steps = ["Email", "OTP", "Reset"];
  const activeStep = location.pathname.includes("verify-otp")
    ? 1
    : location.pathname.includes("reset")
      ? 2
      : 0;

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

  return (
    <>
      <FlowStepper steps={steps} activeStep={activeStep} />
      <Outlet />
    </>
  );
}

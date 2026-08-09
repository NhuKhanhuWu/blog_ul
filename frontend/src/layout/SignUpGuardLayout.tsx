/** @format */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import FlowStepper from "../component/shared/FlowStepper/FlowStepper";
import { useSignUp } from "../context/SignUpContext";

export default function SignUpGuardLayout() {
  const { email, isOtpVerified } = useSignUp();
  const location = useLocation();

  const steps = ["Email", "OTP", "Set up"];
  const activeStep = location.pathname.includes("verify-otp")
    ? 1
    : location.pathname.includes("setup")
      ? 2
      : 0;

  // 1. if !email -> back to email page
  if (
    (location.pathname.includes("verify-otp") ||
      location.pathname.includes("setup")) &&
    !email
  ) {
    return <Navigate to="/auth/signup" replace />;
  }

  // 2. if page==="Password" && !password -> back to OTP page
  if (location.pathname.includes("setup") && !isOtpVerified) {
    return <Navigate to="/auth/signup/verify-otp" replace />;
  }

  return (
    <>
      <FlowStepper steps={steps} activeStep={activeStep} />
      <Outlet />
    </>
  );
}

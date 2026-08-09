/** @format */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import FlowStepper from "../component/shared/FlowStepper/FlowStepper";
import { useChangeEmail } from "../context/ChangeEmailContext";

export default function ChangeEmailGuardLayout() {
  const { isPasswordVerified } = useChangeEmail();
  const location = useLocation();

  const steps = ["Verify", "OTP"];
  const activeStep = location.pathname.includes("verify-otp") ? 1 : 0;

  // if didnt verify password & email -> back to email page
  if (!isPasswordVerified && location.pathname.includes("verify-otp")) {
    return <Navigate to="/account/setting/email" replace />;
  }

  return (
    <>
      <FlowStepper steps={steps} activeStep={activeStep} />
      <Outlet />
    </>
  );
}

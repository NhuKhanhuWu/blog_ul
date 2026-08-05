/** @format */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useChangeEmail } from "../context/ChangeEmailContext";

export default function ChangeEmailGuardLayout() {
  const { isPasswordVerified } = useChangeEmail();
  const location = useLocation();

  // if didnt verify password & email -> back to email page
  if (!isPasswordVerified && location.pathname.includes("verify-otp")) {
    return <Navigate to="/account/setting/email" replace />;
  }

  return <Outlet />;
}

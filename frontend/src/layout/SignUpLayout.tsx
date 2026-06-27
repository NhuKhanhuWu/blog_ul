/** @format */

import { Outlet } from "react-router-dom";
import { SignUpProvider } from "../context/SignUpContext";

export const SignUpLayout = () => {
  return (
    <SignUpProvider>
      <Outlet />
    </SignUpProvider>
  );
};

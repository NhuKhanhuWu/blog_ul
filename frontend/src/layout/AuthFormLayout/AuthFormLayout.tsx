/** @format */

import { Outlet } from "react-router-dom";
import { SignUpProvider } from "../../context/SignUpContext";
import styles from "./AuthFormLayout.module.scss";

function AuthFormLayout() {
  return (
    <SignUpProvider>
      <div className={styles.wrapper}>
        <div className={styles.form}>
          <Outlet />
        </div>
      </div>
    </SignUpProvider>
  );
}

export default AuthFormLayout;

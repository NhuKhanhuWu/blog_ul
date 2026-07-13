/** @format */

import { Outlet } from "react-router-dom";
import styles from "./AuthFormLayout.module.scss";

function AuthFormLayout() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.form}>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthFormLayout;

/** @format */

import { Dispatch, SetStateAction } from "react";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../../hook/shared/reduxHooks";
import styles from "./Navbar.module.scss";
import { TbLogout } from "react-icons/tb";

interface INavLinks {
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

// Default avatar placeholder if the user hasn't uploaded one
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";

function NavLinks({ isOpen, setIsOpen }: INavLinks) {
  const isLogin = useAppSelector((state) => state.auth.isAuthenticated);
  // Get current user information from Redux store (adjust paths according to your slice structure)
  const user = useAppSelector((state) => state.auth.user);

  function handleClose() {
    if (setIsOpen) setIsOpen(!isOpen);
  }

  return (
    <>
      {isLogin ? (
        /* Authenticated View: User Avatar + Account Link + Logout Button */
        <>
          <NavLink
            to="user/me"
            onClick={handleClose}
            className={styles.profileLink}
            title="Account Settings">
            <img
              src={user?.avatar || DEFAULT_AVATAR}
              alt={user?.username || "User Avatar"}
              className={styles.avatarImg}
            />

            <span className={styles.navLinkItemText}>Account</span>
          </NavLink>

          {/* Logout Action */}
          <NavLink
            to="auth/logout"
            onClick={handleClose}
            className={styles.logoutBtn}
            title="Log out">
            <div>
              <TbLogout className={styles.logoutIcon} />
            </div>
            <span className={styles.navLinkItemText}>Log out</span>
          </NavLink>
        </>
      ) : (
        /* Guest View: Login & Sign up Buttons */
        <>
          <NavLink
            to="auth/login"
            onClick={handleClose}
            className={`${styles.linkItem} ${styles.loginBtn}`}>
            <span>Login</span>
          </NavLink>

          <NavLink
            to="auth/signup"
            onClick={handleClose}
            className={`${styles.linkItem} ${styles.signUpBtn}`}>
            <span>Sign up</span>
          </NavLink>
        </>
      )}
    </>
  );
}

export default NavLinks;

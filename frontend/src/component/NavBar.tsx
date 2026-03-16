/** @format */

import { Dispatch, SetStateAction, useState } from "react";
import { Link, NavLink } from "react-router";
import styles from "../styles/component/Navbar.module.scss";
import { useAppSelector } from "../hook/reduxHooks";
import getLogo from "../utils/getLogo";

const navItemsGeneral = [
  { text: "Home", link: "/" },
  { text: "About", link: "/about" },
];

const navItemsLogin = [
  { text: "Account", link: "user/account" },
  { text: "Log out", link: "user/logout" },
];

const navItemsGuest = [
  { text: "Login", link: "auth/login" },
  { text: "Sign up", link: "auth/signup" },
];

interface IHamburgerBtn {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface INavLinks {
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

// including links in navbar
function NavLinks({ isOpen, setIsOpen }: INavLinks) {
  const isLogin = useAppSelector((state) => state.auth.isAuthenticated);

  function handleClose() {
    if (setIsOpen) setIsOpen(!isOpen);
  }

  return (
    <>
      <div className={styles.navLink}>
        {/* ---- general links ----*/}
        {navItemsGeneral.map((item, i) => (
          <NavLink
            onClick={() => handleClose()}
            to={item.link}
            key={`general-nav-${i}`}
            className={styles.linkItem}>
            <span>{item.text}</span>
          </NavLink>
        ))}
      </div>

      <div className={styles.navLink}>
        {isLogin
          ? navItemsLogin.map((item, i) => (
              <NavLink
                onClick={() => handleClose()}
                to={item.link}
                key={`login-nav-${i}`}
                className={styles.linkItem}>
                <span>{item.text}</span>
              </NavLink>
            ))
          : navItemsGuest.map((item, i) => (
              <NavLink
                onClick={() => handleClose()}
                to={item.link}
                key={`guest-nav-${i}`}
                className={styles.linkItem}>
                <span>{item.text}</span>
              </NavLink>
            ))}
      </div>
    </>
  );
}

// including logo and toggle btn
function HamburgerButton({ isOpen, setIsOpen }: IHamburgerBtn) {
  return (
    <button
      className={`${styles.hamburger} ${isOpen ? styles.open : ""}`}
      onClick={() => setIsOpen(!isOpen)}
      aria-label="Toggle menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
}

// nav bars
function NavBarMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const logo = getLogo();

  return (
    <div className={styles.navBar}>
      {/* show part */}
      <div className={`${styles.navBar} ${styles.showBar}`}>
        <Link to="/" className={styles.logo}>
          <img src={logo} loading="lazy" />
        </Link>
        <HamburgerButton isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/* hidden part */}
      <div className={`${styles.collapsed} ${isOpen ? styles.expand : ""}`}>
        <NavLinks isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  );
}

function NavBarDesktop() {
  return (
    <div className={`${styles.showBar} ${styles.navBar}`}>
      <Link to="/" className={styles.logo}>
        <img src="/logo-full-light-mode.png" loading="lazy" />
      </Link>
      <NavLinks />
    </div>
  );
}

function NavBar() {
  return (
    <div className={`${styles.navContainer}`}>
      <div className={styles.navMobile}>
        <NavBarMobile />
      </div>

      <div className={styles.navDesktop}>
        <NavBarDesktop />
      </div>
    </div>
  );
}

export default NavBar;

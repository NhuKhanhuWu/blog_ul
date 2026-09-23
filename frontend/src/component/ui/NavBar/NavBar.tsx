/** @format */

import { Dispatch, SetStateAction, useState } from "react";
import { Link } from "react-router";
import styles from "./Navbar.module.scss";
import useGetLogo from "../../../utils/get-logo";
import NavLinks from "./NavLinks";
import ThemeToggleButton from "./ThemeToggleButton";

interface IHamburgerBtn {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

// Hamburger menu button for Mobile View
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

// Mobile Navbar layout
function NavBarMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const logo = useGetLogo();

  return (
    <div className={styles.navBar}>
      {/* Visible header bar */}
      <div className={`${styles.navBar} ${styles.showBar}`}>
        <Link to="/" className={styles.logo}>
          <img src={logo} loading="lazy" alt="Blogie Logo" />
        </Link>
        <HamburgerButton isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/* Collapsible menu container */}
      <div
        className={`${styles.navItems} ${styles.collapsed} ${
          isOpen ? styles.expand : ""
        }`}>
        <ThemeToggleButton />
        <NavLinks isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  );
}

// Desktop Navbar layout
function NavBarDesktop() {
  const logo = useGetLogo();

  return (
    <div className={`${styles.showBar} ${styles.navBar}`}>
      <Link to="/" className={styles.logo}>
        <img src={logo} loading="lazy" alt="Blogie Logo" />
      </Link>

      <div className={styles.navItems}>
        <ThemeToggleButton />
        <NavLinks />
      </div>
    </div>
  );
}

// Main exported Navbar Wrapper
function NavBar() {
  return (
    <div className={styles.navContainer}>
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

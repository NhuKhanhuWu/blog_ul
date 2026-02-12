/** @format */

import { Dispatch, SetStateAction, useState } from "react";
import { Link } from "react-router";
import "../styles/component/NavbarStyle.scss";

const navItemsGeneral = [
  { text: "Home", link: "/" },
  { text: "About", link: "/about" },
];

const navItemsLogin = [
  {
    text: "Account",
    link: "/account",
  },
  {
    text: "Log out",
    link: "/logout",
  },
];

const navItemsGuest = [
  {
    text: "Login",
    link: "/login",
  },
  {
    text: "Sign up",
    link: "/signup",
  },
];

interface IHamburgerBtn {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

// including links in mobile navbar
function LinksMobile({ isLogin }: { isLogin: boolean }) {
  return (
    <>
      {/* ---- general links ----*/}
      {navItemsGeneral.map((item, i) => (
        <Link to={item.link} key={`general-nav-${i}`} className="link-item">
          <span>{item.text}</span>
        </Link>
      ))}
      {/* ---- general links ----*/}

      {isLogin
        ? //   ---- login links ----
          navItemsLogin.map((item, i) => (
            <Link to={item.link} key={`login-nav-${i}`} className="link-item">
              <span>{item.text}</span>
            </Link>
          ))
        : //   ---- login links ----

          // ---- guest link ----
          navItemsGuest.map((item, i) => (
            <Link to={item.link} key={`guest-nav-${i}`} className="link-item">
              <span>{item.text}</span>
            </Link>
            // ---- guest link ----
          ))}
    </>
  );
}

// including logo and toggle btn
function HamburgerButton({ isOpen, setIsOpen }: IHamburgerBtn) {
  return (
    <button
      className={`hamburger ${isOpen ? "open" : ""}`}
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
  const isLogin = false;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="nav-mobile">
      {/* show part */}
      <div className="show-mobile">
        <Link to="/">
          <img src="/logo-full-light-mode.png" loading="lazy" />
        </Link>
        <HamburgerButton isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/* hidden part */}
      <div className={`hidden-mobile ${isOpen && "open"}`}>
        <LinksMobile isLogin={isLogin}></LinksMobile>
      </div>
    </div>
  );
}

function NavBar() {
  return (
    <>
      <NavBarMobile></NavBarMobile>
    </>
  );
}

export default NavBar;

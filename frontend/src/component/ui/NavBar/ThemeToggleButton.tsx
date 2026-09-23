/** @format */

import { IoMdSunny } from "react-icons/io";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../hook/shared/reduxHooks";
import { toggleTheme } from "../../../redux/themeSlice";
import { FaMoon } from "react-icons/fa";
import styles from "./Navbar.module.scss";

// Theme toggle switch button (Light / Dark mode)
function ThemeToggleButton() {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.theme);

  const isLight = theme === "light";

  return (
    <div>
      <button
        type="button"
        onClick={() => dispatch(toggleTheme())}
        className={`${styles.themeToggle} ${isLight ? styles.light : styles.dark}`}
        title={`Switch to ${isLight ? "Dark" : "Light"} Mode`}
        aria-label="Toggle Theme">
        {/* Sliding thumb container */}
        <div className={styles.thumb} />

        {isLight ? (
          <span className={`${styles.icon} ${styles.sunIcon}`}>
            {/* Sun Icon */}
            <IoMdSunny />
          </span>
        ) : (
          <span className={`${styles.icon} ${styles.moonIcon}`}>
            {/* Moon Icon */}
            <FaMoon />
          </span>
        )}
      </button>

      <span className={styles.navLinkItemText}>
        {isLight ? "Light" : "Dark"} Mode
      </span>
    </div>
  );
}

export default ThemeToggleButton;

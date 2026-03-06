/** @format */

function getLogo() {
  const isDarkMode = false;
  const logo = isDarkMode
    ? "/logo-full-dark-mode.png"
    : "/logo-full-light-mode.png";

  return logo;
}

export default getLogo;

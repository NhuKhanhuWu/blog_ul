/** @format */

import { useAppSelector } from "../hook/shared/reduxHooks";

function useGetLogo() {
  const theme = useAppSelector((state) => state.theme.theme);
  const logo =
    theme == "light" ? "/logo-full-light-mode.png" : "/logo-full-dark-mode.png";

  return logo;
}

export default useGetLogo;

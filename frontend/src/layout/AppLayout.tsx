/** @format */

import { Outlet } from "react-router";
import NavBar from "../component/ui/NavBar/NavBar.tsx";
import { useAppDispatch } from "../hook/shared/reduxHooks.ts";
import { useEffect, useState } from "react";
import { getMeThunk, refreshThunk } from "../redux/auth.slice";
import "../styles/general.scss";
import Loader from "../component/ui/Loader/Loader";

function AppLayout() {
  // auto login when reload/open website
  const dispatch = useAppDispatch();
  // avoid render page before checking auth status (refresh token, get user info)
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // refresh token & get user info when reload to store in redux
    const initAuth = async () => {
      try {
        // Parallelize both requests instead of sequential
        await Promise.all([dispatch(refreshThunk()), dispatch(getMeThunk())]);
      } finally {
        setAuthReady(true);
      }
    };

    initAuth();
  }, [dispatch]);

  if (!authReady) return <Loader />;

  return (
    <div
      className="light"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavBar></NavBar>

      <main>
        <Outlet></Outlet>
      </main>

      {/* TODO: footer here */}
    </div>
  );
}

export default AppLayout;

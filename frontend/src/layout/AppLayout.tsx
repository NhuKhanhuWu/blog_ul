/** @format */

import { Outlet } from "react-router";
import NavBar from "../component/NavBar";
import { useAppDispatch } from "../hook/reduxHooks";
import { useEffect } from "react";
import { getMeThunk, refreshThunk } from "../redux/authSlice";

function AppLayout() {
  // auto login when reload/open website
  const dispatch = useAppDispatch();
  useEffect(() => {
    // refresh token & get user infor when reload to store in redux
    const initAuth = async () => {
      await dispatch(refreshThunk());
      await dispatch(getMeThunk());
    };

    initAuth();
  }, [dispatch]);

  return (
    <div className="light">
      <NavBar></NavBar>

      <main>
        <Outlet></Outlet>
      </main>

      {/* TODO: footer here */}
    </div>
  );
}

export default AppLayout;

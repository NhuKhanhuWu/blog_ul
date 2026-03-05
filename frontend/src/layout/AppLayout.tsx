/** @format */

import { Outlet } from "react-router";
import NavBar from "../component/NavBar";
import { useAppDispatch } from "../hook/reduxHooks";
import { useEffect } from "react";
import { refreshThunk } from "../redux/authSlice";
import { getMe } from "../api/user/getMe";

function AppLayout() {
  // auto login when reload/open website
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(refreshThunk());

    async function test() {
      await getMe();
    }

    // test();
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

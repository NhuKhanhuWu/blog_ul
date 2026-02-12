/** @format */

import { Outlet } from "react-router";
import NavBar from "../component/NavBar";

function AppLayout() {
  return (
    <>
      <NavBar></NavBar>

      <main>
        <Outlet></Outlet>
      </main>

      {/* TODO: footer here */}
    </>
  );
}

export default AppLayout;

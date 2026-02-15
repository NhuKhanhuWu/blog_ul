/** @format */

import { Outlet } from "react-router";
import NavBar from "../component/NavBar";

function AppLayout() {
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

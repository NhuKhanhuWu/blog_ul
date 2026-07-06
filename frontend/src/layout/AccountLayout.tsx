/** @format */

import { FaRegComment, FaRegThumbsUp } from "react-icons/fa";
import Sidebar, { SidebarItem } from "../component/ui/Sidebar/SideBar";
import { Outlet } from "react-router-dom";
import { FiShield } from "react-icons/fi";
import { MdOutlineMail } from "react-icons/md";

function AccountLayout() {
  // const navigate = useNavigate();

  const accountSetting: SidebarItem[] = [
    {
      text: "Email",
      icon: <MdOutlineMail />,
      to: "/account/setting/email",
    },
    {
      text: "Password",
      icon: <FiShield />,
      to: "/account/setting/password",
    },
  ];

  const accountActivity: SidebarItem[] = [
    {
      text: "Votes",
      icon: <FaRegThumbsUp />,
      to: "/account/activity/votes",
    },
    {
      text: "Comments",
      icon: <FaRegComment />,
      to: "/account/activity/comments",
    },
  ];

  return (
    <>
      <Sidebar
        title="My Admin Dashboard"
        menuGroups={[accountSetting, accountActivity]}>
        <Outlet />
      </Sidebar>
    </>
  );
}

export default AccountLayout;

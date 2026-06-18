/** @format */
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import BlogListsTab from "../../component/profile/BlogListsTab/BlogListTab";
import BlogsTab from "../../component/profile/BlogsTab/BlogsTab";
import { useState } from "react";
import a11yProps from "../../utils/a11yProps";
import CustomTabPanel from "../../component/ui/CustomTabPanel/CustomTabPanel";
import { useAppSelector } from "../../hook/reduxHooks";
import ProfileHeader from "../../component/profile/ProfileHeader/ProfileHeader";
import styles from "./Me.module.scss";
import { Link } from "react-router-dom";

function ActionBtns() {
  return (
    <div className={styles.profileActions}>
      {/* account setting */}
      <button className="btn-secondary">Edit profile</button>

      <Link to="/account/setting" className="btn-secondary">
        Account setting
      </Link>
    </div>
  );
}

function Me() {
  const user = useAppSelector((state) => state.auth.user);
  const tabList = [
    {
      name: "Blogs",
      element: <BlogsTab user={user || undefined} />,
    },
    { name: "Saved", element: <BlogListsTab /> },
  ];
  const [curTab, setCurTab] = useState(0);

  function handleChange(_event: React.SyntheticEvent, newValue: number) {
    // if (event) console.log("");
    setCurTab(newValue);
  }

  if (!user) return <p>User not found</p>;

  return (
    <div className={styles.container}>
      {/*  Header Profile Info Section */}
      <ProfileHeader user={user} btns={<ActionBtns />} />

      {/* Navigation Tabs (YouTube Style) */}
      <Tabs
        value={curTab}
        onChange={handleChange}
        aria-label="profile navigation tabs"
        textColor="inherit"
        className={styles.tabHeader}>
        {tabList.map((tab, i) => (
          <Tab
            className={styles.tabBtn}
            key={i}
            label={tab.name}
            {...a11yProps(i)}
          />
        ))}
      </Tabs>

      {/* Tab Panels Content Render */}
      {tabList.map((tab, i) => (
        <CustomTabPanel key={i} value={curTab} index={i}>
          {tab.element}
        </CustomTabPanel>
      ))}
    </div>
  );
}

export default Me;

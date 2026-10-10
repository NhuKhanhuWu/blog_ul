/** @format */

import { useQuery } from "@tanstack/react-query";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getUserBySlug } from "../../api/user.api";
import BlogsTab from "../../component/profile/BlogsTab/BlogsTab";
import ProfileHeader from "../../component/profile/ProfileHeader/ProfileHeader";
import PublicSavedTab from "../../component/profile/PublicSavedTab/PublicSavedTab";
import CustomTabPanel from "../../component/ui/CustomTabPanel/CustomTabPanel";
import Loader from "../../component/ui/Loader/Loader";
import NotFound from "../../component/ui/NotFound/NotFound";
import a11yProps from "../../utils/core/a11yProps";
import { getErrorMessage } from "../../utils/core/get-error-message";
import styles from "../Me/Me.module.scss";

function PublicProfile() {
  const { slug = "" } = useParams();
  const [curTab, setCurTab] = useState(0);
  const { data: user, isPending, isError, error } = useQuery({
    queryKey: ["public-user", slug],
    queryFn: () => getUserBySlug(slug),
    enabled: Boolean(slug),
  });

  function handleChange(_event: React.SyntheticEvent, newValue: number) {
    setCurTab(newValue);
  }

  if (isPending) return <Loader />;
  if (isError) {
    return <NotFound message={getErrorMessage(error)} />;
  }
  if (!user) return <NotFound message="User not found" />;

  const tabs = [
    { name: "Blogs", element: <BlogsTab user={user} publicProfile /> },
    {
      name: "Saved",
      element: <PublicSavedTab userId={user._id} />,
    },
  ];

  return (
    <div className={styles.container}>
      <ProfileHeader user={user} />
      <Tabs
        value={curTab}
        onChange={handleChange}
        aria-label="profile navigation tabs"
        textColor="inherit"
        className={styles.tabHeader}>
        {tabs.map((tab, index) => (
          <Tab
            className={styles.tabBtn}
            key={tab.name}
            label={tab.name}
            {...a11yProps(index)}
          />
        ))}
      </Tabs>

      {tabs.map((tab, index) => (
        <CustomTabPanel key={tab.name} value={curTab} index={index}>
          <div className={styles.tabContent}>{tab.element}</div>
        </CustomTabPanel>
      ))}
    </div>
  );
}

export default PublicProfile;

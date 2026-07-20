/** @format */

import { useState } from "react";
import BlogVotes from "../../component/my-votes/BlogVotes/BlogVotes";
import CommentVotes from "../../component/my-votes/CommentVotes/CommentVotes";
import Tabs from "@mui/material/Tabs";
import styles from "./MyVotes.module.scss";
import Tab from "@mui/material/Tab";
import a11yProps from "../../utils/a11yProps";
import CustomTabPanel from "../../component/ui/CustomTabPanel/CustomTabPanel";

function MyVotes() {
  const tabList = [
    {
      name: "Blogs",
      element: <BlogVotes />,
    },
    { name: "Comment", element: <CommentVotes /> },
  ];
  const [curTab, setCurTab] = useState(0);

  function handleChange(_event: React.SyntheticEvent, newValue: number) {
    setCurTab(newValue);
  }

  return (
    <>
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
          <div className={styles.tabContent}>{tab.element}</div>
        </CustomTabPanel>
      ))}
    </>
  );
}

export default MyVotes;

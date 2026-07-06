/** @format */

import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// Import file SCSS Module
import styles from "./Sidebar.module.scss";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export interface SidebarItem {
  text: string;
  icon: React.ReactNode;
  to: string;
  onClick?: () => void;
}

interface SidebarProps {
  title?: string;
  menuGroups: SidebarItem[][];
  children: React.ReactNode;
}

export default function Sidebar({ menuGroups, children }: SidebarProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Box className={styles.layoutContainer}>
      {/*  SIDEBAR (DRAWER) */}
      <Drawer
        variant="permanent"
        className={`${styles.drawer} ${!open ? styles.drawerClose : ""}`}>
        <div className={styles.drawerHeader}>
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <FaChevronLeft /> : <FaChevronRight />}
          </IconButton>
        </div>

        {menuGroups.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            <Divider className={styles.divider} />
            <List component="nav">
              {group.map((item) => (
                <ListItem
                  key={item.text}
                  disablePadding
                  sx={{ display: "block" }}>
                  <ListItemButton
                    to={item.to}
                    component={NavLink}
                    onClick={item.onClick}
                    className={`${styles.listItemButton} ${open ? styles.initialJustify : styles.centerJustify} `}>
                    <ListItemIcon
                      className={`${styles.listItemIcon} ${open ? styles.marginRight : styles.marginAuto}`}>
                      {item.icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={item.text}
                      className={`${styles.listItemText} ${open ? styles.visible : styles.hidden}`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </React.Fragment>
        ))}
      </Drawer>

      {/*  MAIN WORKSPACE */}
      <Box component="main" className={styles.mainContent}>
        {children}
      </Box>
    </Box>
  );
}

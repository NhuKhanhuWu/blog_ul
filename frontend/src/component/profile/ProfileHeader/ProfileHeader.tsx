/** @format */

import { UserPublic } from "../../../types/auth.type";
import defaultAvatar from "../../../utils/default-avatar";
import { ReactNode } from "react";
import styles from "./ProfileHeader.module.scss";

interface ProfileHeaderProps {
  user: UserPublic;
  btns?: ReactNode;
}

function ProfileHeader({ user, btns }: ProfileHeaderProps) {
  const avatar = user?.avatar || defaultAvatar(user?.name || "");

  return (
    <div className={styles.profileHeader}>
      {/* Large Profile Avatar */}
      <img
        className={styles.avatar}
        alt={user?.name}
        src={avatar} // Replace with actual avatar URL if available
      />

      {/* User Details */}
      <div className={styles.userDetail}>
        <h4>{user?.name}</h4>
        <p>@{user?.slug}</p>

        {btns}
      </div>
    </div>
  );
}

export default ProfileHeader;

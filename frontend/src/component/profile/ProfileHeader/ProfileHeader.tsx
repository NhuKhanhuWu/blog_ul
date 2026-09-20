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
  const avatar = user?.avatar || defaultAvatar(user?.username || "");
  const avatarUrl = user.updatedAt
    ? `${avatar}${avatar.includes("?") ? "&" : "?"}v=${encodeURIComponent(user.updatedAt)}`
    : avatar;

  return (
    <div className={styles.profileHeader}>
      {/* Large Profile Avatar */}
      <img className={styles.avatar} alt={user?.username} src={avatarUrl} />

      {/* User Details */}
      <div className={styles.userDetail}>
        <h4>{user?.username}</h4>
        <p>@{user?.slug}</p>

        {btns}
      </div>
    </div>
  );
}

export default ProfileHeader;

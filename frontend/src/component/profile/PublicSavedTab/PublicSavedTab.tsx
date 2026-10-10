/** @format */

import { useQuery } from "@tanstack/react-query";
import { getMultList } from "../../../api/blog-list.api";
import Loader from "../../ui/Loader/Loader";
import { Link } from "react-router-dom";
import styles from "../BlogListsTab/BlogListTab.module.scss";

function PublicSavedTab({ userId }: { userId: string }) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["public-profile-blog-lists", userId],
    queryFn: () => getMultList(userId, undefined, true),
    enabled: Boolean(userId),
  });
  const publicLists = data?.filter((list) => !list.isPrivate) ?? [];

  return (
    <div className={styles.blogListsContainer}>
      {isPending && <Loader />}
      {isError && <p className="error-mgs">{error.message}</p>}
      {!isPending && !isError && publicLists.length === 0 && (
        <p>No saved blogs found.</p>
      )}

      {publicLists.map((list) => (
        <div className={styles.listItem} key={list._id}>
          <Link to={`/list/${list._id}`} className={styles.imgWrapper}>
            <img
              className={styles.img}
              src={list.listAvatar || "/placeholder-img.jpg"}
              loading="lazy"
              alt={list.name}
            />
          </Link>

          <div className={styles.txtContainer}>
            <Link to={`/list/${list._id}`}>
              <p className={styles.name}>{list.name}</p>
              <p style={{ color: "var(--text-muted)" }}>
                {list.blogsCnt} blogs
              </p>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PublicSavedTab;

/** @format */

import { TbZoomQuestion } from "react-icons/tb";
import styles from "../styles/component/NotFound.module.scss";

function NotFound({ message }: { message: string }) {
  return (
    <div className={styles.container}>
      <TbZoomQuestion className={styles.icon} />
      <p className={styles.message}>{message}</p>
    </div>
  );
}

export default NotFound;

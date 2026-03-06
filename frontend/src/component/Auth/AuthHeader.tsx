/** @format */

import styles from "../../styles/component/Auth.module.scss";
import getLogo from "../../utils/getLogo";

interface Props {
  title: string;
  subtitle: string;
}

function AuthHeader({ title, subtitle }: Props) {
  const logo = getLogo();

  return (
    <>
      <img className={styles.logo} src={logo} loading="lazy" alt="logo" />

      <div className={styles.welcomeTxt}>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </>
  );
}

export default AuthHeader;

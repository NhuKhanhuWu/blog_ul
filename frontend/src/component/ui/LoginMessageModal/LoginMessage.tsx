/** @format */
import { Link } from "react-router-dom";
import styles from "./LoginMessage.module.scss";

interface LoginMessageInput {
  header: string;
  message: string;
}

function LoginMessage({ header, message }: LoginMessageInput) {
  return (
    // if not login, show this message
    <div className={styles.container}>
      <p className={styles.modalHeader}>{header}</p>
      <p>{message}</p>
      <Link to="/auth/login" className="btn-primary">
        Login
      </Link>
    </div>
  );
}

export default LoginMessage;

/** @format */

import { Link } from "react-router-dom";

interface Props {
  type: "login" | "signup";
}

function AuthFooter({ type }: Props) {
  if (type === "login") {
    return (
      <p>
        Don't have an account? <Link to="/auth-signup">Sign up</Link>
      </p>
    );
  }

  return (
    <p>
      Already have an account? <Link to="/auth-login">Log in</Link>
    </p>
  );
}

export default AuthFooter;

/** @format */

import { FaArrowLeftLong } from "react-icons/fa6";
import { Link } from "react-router-dom";

function ReEnterEmail({ link }: { link: string }) {
  return (
    <Link
      to={link}
      style={{
        alignSelf: "flex-start",
        display: "flex",
        gap: "1rem",
        alignItems: "center",
      }}>
      <FaArrowLeftLong /> Re-enter email
    </Link>
  );
}

export default ReEnterEmail;

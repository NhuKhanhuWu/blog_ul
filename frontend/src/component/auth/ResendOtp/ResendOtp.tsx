/** @format */

import { UseMutateFunction } from "@tanstack/react-query";
import useCountdown from "../../../hook/shared/useCountDown";

interface ResendOtpProps {
  email: string;
  mutate: UseMutateFunction<unknown, Error, string, unknown>;
  resetTime?: number;
  label?: string;
  isPending: boolean;
}

function ResendOtp({
  email,
  mutate,
  resetTime = 60,
  label = "Resend",
  isPending,
}: ResendOtpProps) {
  const { seconds, reset } = useCountdown(resetTime);

  function handleSendEmail() {
    if (seconds > 0) return;

    mutate(email, {
      onSuccess: () => {
        reset(resetTime);
      },
    });
  }

  const style: React.CSSProperties = {
    fontWeight: 600,
    textDecoration: "underline",
    cursor: seconds > 0 || isPending ? "not-allowed" : "pointer",
    color:
      seconds > 0 || isPending ? "var(--text-muted)" : "var(--accent-color)",
  };

  return (
    <p>
      Didn't receive our mail?
      <span className="btn" onClick={handleSendEmail} style={style}>
        {` ${label} `}
      </span>
      in {seconds}s
    </p>
  );
}

export default ResendOtp;

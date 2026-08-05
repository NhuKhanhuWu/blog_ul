/** @format */

import useCountdown from "../../../hook/shared/useCountDown";

type ResendOtpProps<T> = {
  payload: T;
  mutate: (
    variables: T,
    options?: { onSuccess?: () => void; onError?: (error: unknown) => void },
  ) => void;
  resetTime?: number;
  label?: string;
  isPending?: boolean;
};

function ResendOtp<T>({
  payload,
  mutate,
  resetTime = 60,
  label = "Resend",
  isPending = false,
}: ResendOtpProps<T>) {
  const { seconds, reset } = useCountdown(resetTime);

  function handleSendEmail() {
    if (seconds > 0 || isPending) return;

    // pass payload to mutate
    mutate(payload, {
      onSuccess: () => {
        reset(resetTime);
      },
    });
  }

  const isDisabled = seconds > 0 || isPending;

  const style: React.CSSProperties = {
    fontWeight: 600,
    textDecoration: "underline",
    cursor: isDisabled ? "not-allowed" : "pointer",
    color: isDisabled ? "var(--text-muted)" : "var(--accent-color)",
  };

  return (
    <p>
      Didn't receive our mail?{" "}
      <span className="btn" onClick={handleSendEmail} style={style}>
        {label}
      </span>{" "}
      in {seconds}s
    </p>
  );
}

export default ResendOtp;

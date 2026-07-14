/** @format */

function AttemptsCounter({ attemptsLeft }: { attemptsLeft: number }) {
  if (attemptsLeft <= 0) {
    return (
      <p className="error-mgs">
        Out of attempts, please click resend OTP or re-enter your email
      </p>
    );
  }

  return (
    <p style={{ color: "var(--text-muted)" }}>
      {attemptsLeft} {attemptsLeft === 1 ? "attempt" : "attempts"} left
    </p>
  );
}

export default AttemptsCounter;

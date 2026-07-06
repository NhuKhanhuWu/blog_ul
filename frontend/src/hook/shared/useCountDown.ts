/** @format */

import { useState, useEffect } from "react";

function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // Clean up to avoid memory leak
  }, [seconds]);

  return { seconds, reset: (secs: number) => setSeconds(secs) };
}

export default useCountdown;
// how to use in component:
// const { seconds, reset } = useOtpCountdown(60);

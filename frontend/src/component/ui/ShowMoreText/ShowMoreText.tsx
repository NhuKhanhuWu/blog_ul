/** @format */

import React, { useState, useRef, useEffect } from "react";
import styles from "./ShowMoreText.module.scss";

interface ShowMoreTextProps {
  text: React.ReactNode;
  lines?: number;
  className?: string; // Class CSS
}

export const ShowMoreText: React.FC<ShowMoreTextProps> = ({
  text,
  lines = 1,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hasOverflow, setHasOverflow] = useState<boolean>(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    // listen to screen size's changes to calculate rows cnt
    const resizeObserver = new ResizeObserver(() => {
      // scrollHeight: actual height of text
      // clientHeight: limit height show on screen
      const isClamped = element.scrollHeight > element.clientHeight;

      // only ondate over flow state of NOT expand
      if (!isExpanded) {
        setHasOverflow(isClamped);
      }
    });

    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [text, isExpanded]);

  if (!text) return null;

  return (
    <div className={`${styles.container} ${className}`}>
      <p
        ref={textRef}
        className={`${styles.text} ${!isExpanded ? styles.clamp : ""}`}
        style={{
          WebkitLineClamp: !isExpanded ? lines : "unset",
        }}>
        {text}
      </p>

      {/* btn See more / Show less only show when the line exceed limit */}
      {(hasOverflow || isExpanded) && (
        <button
          type="button"
          className={styles.button}
          onClick={() => {
            // if about to collap, only set overflow state so the btn does not disappear
            if (isExpanded) {
              setHasOverflow(true);
            }
            setIsExpanded(!isExpanded);
          }}>
          {isExpanded ? "Show less" : "See more"}
        </button>
      )}
    </div>
  );
};

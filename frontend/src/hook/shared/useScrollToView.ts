/** @format */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

interface UseScrollToViewArgs {
  id?: string;
  isLoading?: boolean;
  onOpenModal?: () => void;
  modalWidth?: number; // max width of the screen where
  delay?: number;
  highlightClassName?: string; // Class CSS for highlight
  highlightDuration?: number;
}

export const useScrollToView = ({
  id,
  isLoading = false,
  onOpenModal,
  modalWidth = 768,
  delay = 300,
  highlightClassName = "active-highlight",
  highlightDuration = 3000,
}: UseScrollToViewArgs) => {
  const location = useLocation();
  const handledTargetRef = useRef<string | null>(null);

  useEffect(() => {
    // Extract element ID from parameter or fallback to URL hash
    let targetId = id;

    if (!targetId && location.hash) {
      targetId = location.hash.replace("#", "");
    }

    // Stop execution if no valid ID exists or if data is still loading
    if (!targetId || isLoading) return;

    const targetKey = `${location.pathname}${location.search}#${targetId}`;

    if (handledTargetRef.current === targetKey) {
      return;
    }

    handledTargetRef.current = targetKey;

    // Open mobile modal first if the device screen matches mobile viewport
    const isMobile = window.innerWidth <= modalWidth;
    if (isMobile && typeof onOpenModal === "function") {
      onOpenModal();
    }

    // Schedule scroll operation after a brief delay to ensure DOM readiness
    const timer = setTimeout(() => {
      const targetElement = document.getElementById(targetId);

      // scroll to view
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "center", // Align element to the center of the viewport
        });
      }

      // add highlight class
      if (highlightClassName && targetElement) {
        targetElement.classList.add(highlightClassName);

        // remove class after animation
        setTimeout(() => {
          targetElement.classList.remove(highlightClassName);
        }, highlightDuration);
      }
    }, delay);

    // Clean up timer to prevent memory leaks if component unmounts
    return () => clearTimeout(timer);
  }, [
    location.hash,
    location.pathname,
    location.search,
    id,
    isLoading,
    onOpenModal,
    delay,
    highlightClassName,
    highlightDuration,
    modalWidth,
  ]);
};

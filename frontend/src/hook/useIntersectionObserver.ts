/** @format */

import { useCallback, useRef } from "react";

export function useIntersectionObserver(
  callback: () => void,
  isLoading: boolean,
  hasNextPage: boolean | undefined,
) {
  const observer = useRef<IntersectionObserver>();

  // Ref này sẽ được gắn vào phần tử cuối danh sách
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          callback();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, callback],
  );

  return { lastElementRef };
}

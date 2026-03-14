/** @format */

import { ReactNode } from "react";

interface IInfinityObserver {
  children: ReactNode;
  lastElementRef: (node: HTMLDivElement) => void;
}

function InfinityObserver({ children, lastElementRef }: IInfinityObserver) {
  return (
    <div ref={lastElementRef} style={{ height: "10px" }}>
      {children}
    </div>
  );
}

export default InfinityObserver;

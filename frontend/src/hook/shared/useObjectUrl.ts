/** @format */

import { useState, useEffect, useRef } from "react";

export const useObjectUrl = () => {
  const [url, setUrl] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  const createUrl = (blobOrFile: Blob | MediaSource) => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
    }
    const newUrl = URL.createObjectURL(blobOrFile);
    urlRef.current = newUrl;
    setUrl(newUrl);
    return newUrl;
  };

  const clearUrl = () => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
      setUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  return { url, createUrl, clearUrl };
};

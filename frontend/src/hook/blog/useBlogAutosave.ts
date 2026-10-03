/** @format */

import { useCallback, useEffect, useRef } from "react";

interface UseAutosaveProps {
  revision: number;
  save: () => void;
  debounce?: number;
  maxWait?: number;
}

export function useBlogAutosave({
  revision,
  save,
  debounce = 15_000,
  maxWait = 60_000,
}: UseAutosaveProps) {
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const maxWaitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveRef = useRef(save);

  const cancelPendingSaves = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }

    if (maxWaitTimer.current) {
      clearTimeout(maxWaitTimer.current);
      maxWaitTimer.current = null;
    }
  }, []);

  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  useEffect(() => {
    if (revision === 0) {
      return;
    }

    /*
     * Debounce:
     * Save 15s after the last change.
     */
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      saveRef.current();

      if (maxWaitTimer.current) {
        clearTimeout(maxWaitTimer.current);
        maxWaitTimer.current = null;
      }
    }, debounce);

    /*
     * Max wait:
     * Ensure continuous editing is saved at least
     * once every 60s.
     */
    if (!maxWaitTimer.current) {
      maxWaitTimer.current = setTimeout(() => {
        maxWaitTimer.current = null;

        saveRef.current();

        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
          debounceTimer.current = null;
        }
      }, maxWait);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }
    };
  }, [revision, debounce, maxWait]);

  useEffect(() => {
    return cancelPendingSaves;
  }, [cancelPendingSaves]);

  return cancelPendingSaves;
}

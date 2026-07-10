/** @format */

import { useState, useCallback } from "react";

interface TaggedUser {
  userId: string;
  slug: string;
}

export function useMentionState(initial: TaggedUser | null) {
  const [taggedUser, setTaggedUser] = useState<TaggedUser | null>(initial);

  const removeMention = useCallback(() => setTaggedUser(null), []);

  const handleBackspaceOnEmptyInput = useCallback(
    (text: string) => {
      if (text.length === 0 && taggedUser !== null) {
        removeMention();
        return true; //
      }
      return false;
    },
    [taggedUser, removeMention],
  );

  return { taggedUser, removeMention, handleBackspaceOnEmptyInput };
}

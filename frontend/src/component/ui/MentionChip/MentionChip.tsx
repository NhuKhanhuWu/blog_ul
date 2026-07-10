/** @format */

import styles from "./MentionChip.module.scss";

interface MentionChipProps {
  slug: string;
  onRemove?: () => void; // don't pass => can't delete => read only
  disabled?: boolean; // use when submit, avoild delete when pending
}

function MentionChip({ slug, onRemove, disabled = false }: MentionChipProps) {
  return (
    <span className={styles.mentionChip}>
      @{slug}
      {onRemove && (
        <button
          type="button"
          className={styles.removeBtn}
          onClick={onRemove}
          disabled={disabled}
          aria-label={`remove tag @${slug}`}>
          x
        </button>
      )}
    </span>
  );
}

export default MentionChip;

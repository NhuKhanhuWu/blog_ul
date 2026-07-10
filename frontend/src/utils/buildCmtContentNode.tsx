/** @format */

import { Link } from "react-router-dom";
import MentionChip from "../component/ui/MentionChip/MentionChip";
import { CmtMentionProps } from "../types/comment.type";

interface CmtContentWithMentionProps {
  content: string;
  mentions?: CmtMentionProps[];
}

export function buildCmtContentNode({
  content,
  mentions = [],
}: CmtContentWithMentionProps): React.ReactNode {
  if (mentions.length === 0) {
    return content;
  }

  // righ now there is only one mention in cmt, always in cmt head
  const mention = mentions[0];
  const restText = content.slice(mention.offset + mention.length).trim();

  return (
    <>
      <Link to={`/profile/${mention.slug}`} className="mention-link">
        <MentionChip slug={mention.slug} />
      </Link>{" "}
      {restText}
    </>
  );
}

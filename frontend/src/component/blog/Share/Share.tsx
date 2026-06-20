/** @format */

import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  FacebookShareButton,
  FacebookIcon,
  XShareButton,
  XIcon,
  EmailShareButton,
  EmailIcon,
  LinkedinShareButton,
  LinkedinIcon,
  RedditShareButton,
  RedditIcon,
} from "react-share";
import { PiShareFatBold } from "react-icons/pi";
import { useState } from "react";
import ModalOverlay from "../../ui/Modal/Modal";
import { MdOutlineContentCopy } from "react-icons/md";
import toast from "react-hot-toast";
import styles from "./Share.module.scss";

function Share() {
  const [isSharing, setIsSharing] = useState(false);
  const url = window.location.href;
  const iconSize = 50;

  return (
    <>
      {isSharing && (
        <ModalOverlay isShow={isSharing} setIsShow={setIsSharing}>
          <div className={styles.shareContainer}>
            <p className={styles.modalHeader}>Share this blog</p>

            <div className={styles.shareIcons}>
              <FacebookShareButton url={url}>
                <FacebookIcon size={iconSize} round />
              </FacebookShareButton>
              <XShareButton url={url}>
                <XIcon size={iconSize} round />
              </XShareButton>
              <EmailShareButton url={url}>
                <EmailIcon size={iconSize} round />
              </EmailShareButton>
              <LinkedinShareButton url={url}>
                <LinkedinIcon size={iconSize} round />
              </LinkedinShareButton>
              <RedditShareButton url={url}>
                <RedditIcon size={iconSize} round />
              </RedditShareButton>
            </div>

            <div className={styles.shareCopy}>
              <input type="text" value={url} disabled></input>
              <CopyToClipboard text={url}>
                <MdOutlineContentCopy
                  onClick={() => toast.success("Copied!")}
                />
              </CopyToClipboard>
            </div>
          </div>
        </ModalOverlay>
      )}

      <span className={styles.icon}>
        <PiShareFatBold onClick={() => setIsSharing(!isSharing)} />
      </span>
    </>
  );
}

export default Share;

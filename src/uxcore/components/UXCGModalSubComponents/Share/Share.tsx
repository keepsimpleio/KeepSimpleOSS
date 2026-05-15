import React, { FC } from 'react';

import styles from './Share.module.scss';

type ShareProps = {
  shareTxt?: string;
  linkedIn?: string;
  facebook?: string;
  tweeter?: string;
};

const Share: FC<ShareProps> = ({ shareTxt, linkedIn, facebook, tweeter }) => {
  return (
    <div className={styles.Share}>
      <span className={styles.ShareTxt}>{shareTxt}</span>
      <div className={styles.Tooltip}>
        <a
          href={linkedIn}
          target="_blank"
          title="LinkedIn"
          className={styles.shareLink}
        >
          <img
            src="/assets/biases/linkedin.svg"
            alt="linked-in-share-button"
            className={styles.shareImg}
          />
        </a>
        <a
          href={facebook}
          target="_blank"
          title="Facebook"
          className={styles.shareLink}
        >
          <img
            src="/assets/biases/facebook.svg"
            alt="facebook-share-button"
            className={styles.shareImg}
          />
        </a>
        <a
          href={tweeter}
          target="_blank"
          title="Twitter"
          className={styles.shareLink}
        >
          <img
            src="/assets/biases/TwitterX.svg"
            alt="tweeter-share-button"
            className={styles.shareImgTwitter}
          />
        </a>
      </div>
    </div>
  );
};
export default Share;

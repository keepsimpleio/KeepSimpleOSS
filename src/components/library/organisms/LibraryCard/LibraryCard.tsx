import { useRouter } from 'next/router';
import React, { JSX } from 'react';

import { Avatar } from '@components/library/atoms/Avatar';
import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { Button, ButtonType } from '@components/library/molecules/Button';
import { Object, ObjectType } from '@components/library/molecules/Object';

import type { LibraryCardProps } from './LibraryCard.types';

import styles from './LibraryCard.module.scss';

export function LibraryCard(props: LibraryCardProps): JSX.Element {
  const {
    id,
    username,
    libraryName,
    description,
    bookCount,
    videoCount,
    songCount,
    avatar,
  } = props;
  const router = useRouter();

  const handleViewLibrary = () => {
    // Route by numeric id, not username: the route resolver short-circuits a
    // numeric param to a findOne-by-id, sidestepping the username→id filter
    // lookup that the public API currently 500s on. Falls back to username only
    // if an id is somehow absent.
    router.push(`/library/${id ?? username}`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Text
          className={styles.title}
          variant={TypographyVariant.SubtitleSecondaryAlt}
        >
          {libraryName}
        </Text>
      </div>

      <div className={styles.body}>
        <div className={styles.content}>
          <div className={styles.avatar}>
            <Avatar url={avatar} />
          </div>
          <div className={styles.info}>
            <div className={styles.section}>
              <Text
                className={styles.subtitle}
                variant={TypographyVariant.TextBaseBold}
              >
                About
              </Text>
              <Text
                className={styles.text}
                variant={TypographyVariant.TextBase}
              >
                {description}
              </Text>
            </div>
            <div className={styles.section}>
              <Text
                className={styles.subtitle}
                variant={TypographyVariant.TextBaseBold}
              >
                Objects
              </Text>
              <div className={styles.objects}>
                <Object
                  className={styles.count}
                  type={ObjectType.Book}
                  number={bookCount}
                />
                <Object
                  className={styles.count}
                  type={ObjectType.Video}
                  number={videoCount}
                />
                <Object
                  className={styles.count}
                  type={ObjectType.Audio}
                  number={songCount}
                />
              </div>
            </div>
          </div>
        </div>
        <Button
          onClick={handleViewLibrary}
          type={ButtonType.Primary}
          label="View Library"
          ariaLabel="View Library"
        />
      </div>
    </div>
  );
}

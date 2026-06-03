import { mapStrapiLibrariesResponseToCards } from '@utils/library/mapStrapiLibraries';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';

import type { HomeLibraryCardView } from '@local-types/library/library';

import { getLibrariesPaginated } from '@api/library/strapi';

import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { AboutLibraryModal } from '@components/library/molecules/AboutLibraryModal';
import {
  Button,
  ButtonSize,
  ButtonType,
} from '@components/library/molecules/Button';
import { Input } from '@components/library/molecules/Input';
import { Pagination } from '@components/library/molecules/Pagination';
import { LibraryCard } from '@components/library/organisms/LibraryCard';

import { HomeTemplateProps } from './Home.types';

import styles from './Home.module.scss';

const sectionId = 'libraries-section';

const perPage = 8;

export function HomeTemplate({ data: dataOverride }: HomeTemplateProps) {
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [remoteItems, setRemoteItems] = useState<HomeLibraryCardView[]>([]);
  const [remotePageCount, setRemotePageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(!dataOverride);

  const isControlled = dataOverride !== undefined;

  useEffect(() => {
    if (isControlled) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      const response = await getLibrariesPaginated(currentPage, perPage);
      if (cancelled) {
        return;
      }
      if (response) {
        const base = process.env.NEXT_PUBLIC_STRAPI;
        setRemoteItems(mapStrapiLibrariesResponseToCards(response, base));
        setRemotePageCount(response.meta.pagination.pageCount || 1);
      } else {
        setRemoteItems([]);
        setRemotePageCount(1);
      }
      setIsLoading(false);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [isControlled, currentPage]);

  const { totalPages, currentLibraries } = useMemo(() => {
    if (isControlled) {
      const data = dataOverride ?? [];
      const pages = Math.max(1, Math.ceil(data.length / perPage));
      const startIndex = (currentPage - 1) * perPage;

      return {
        totalPages: pages,
        currentLibraries: data.slice(startIndex, startIndex + perPage),
      };
    }

    return {
      totalPages: Math.max(1, remotePageCount),
      currentLibraries: remoteItems,
    };
  }, [isControlled, dataOverride, currentPage, remoteItems, remotePageCount]);

  const modalToggler = () => {
    setIsOpen(!isOpen);
  };

  const scrollToSection = () => {
    const section = document.getElementById(sectionId);

    if (section) {
      const offset = 48;
      const sectionPosition =
        section.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: sectionPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToSection();
  };

  const changeValueHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const renderLibraryCards = currentLibraries.map(
    ({
      id,
      username,
      libraryName,
      description,
      bookCount,
      videoCount,
      songCount,
      avatar,
    }) => (
      <LibraryCard
        key={id}
        id={id}
        username={username}
        libraryName={libraryName}
        description={description}
        bookCount={bookCount}
        videoCount={videoCount}
        songCount={songCount}
        avatar={avatar}
      />
    ),
  );

  return (
    <main className="library">
      <section className={styles.banner}>
        <Image
          className={styles.image}
          src="/library/images/readmeImages/cover.png"
          alt="Next.js logo"
          width={1980}
          height={900}
          priority
        />
        <Button
          label="What is this place?"
          onClick={modalToggler}
          type={ButtonType.Primary}
          size={ButtonSize.Wide}
          ariaLabel="What is this place modal"
          className={styles.button}
        />
      </section>

      <section className={styles.libraries} id={sectionId}>
        <div className="container">
          <div className={styles.controls}>
            <Text
              className={styles.title}
              variant={TypographyVariant.TitlePrimary}
            >
              Libraries
            </Text>
            <Input
              type="search"
              value={value}
              placeholder="Search everywhere"
              placeholderColor="#C4C4C4"
              onChange={changeValueHandler}
              onClear={() => setValue('')}
              wrapperClassName={styles.input}
            />
          </div>

          <div className={styles.content}>
            {isLoading && !isControlled ? (
              <Text variant={TypographyVariant.TextBase}>
                Loading libraries…
              </Text>
            ) : (
              renderLibraryCards
            )}
          </div>

          <div className={styles.pagination}>
            <Pagination count={totalPages} onChange={handlePageChange} />
          </div>
        </div>
      </section>

      {isOpen && <AboutLibraryModal onClose={modalToggler} />}
    </main>
  );
}

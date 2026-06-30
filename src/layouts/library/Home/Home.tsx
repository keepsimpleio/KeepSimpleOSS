import { mapStrapiLibrariesResponseToCards } from '@utils/library/mapStrapiLibraries';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import type { HomeLibraryCardView } from '@local-types/library/library';

import { getLibrariesPaginated } from '@api/library/getLibrariesPaginated';
import { getMyLibrary } from '@api/library/getMyLibrary';

import PlusIcon from '@icons/library/svg/plus.svg';

import { useAuth } from '@components/Context/library/AuthContext';
import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { AboutLibraryModal } from '@components/library/molecules/AboutLibraryModal';
import {
  Button,
  ButtonSize,
  ButtonType,
} from '@components/library/molecules/Button';
import { Input } from '@components/library/molecules/Input';
import { Pagination } from '@components/library/molecules/Pagination';
import { InteractiveCover } from '@components/library/organisms/InteractiveCover';
import { LibraryCard } from '@components/library/organisms/LibraryCard';

import { HomeTemplateProps } from './Home.types';

import styles from './Home.module.scss';

const sectionId = 'libraries-section';

const perPage = 6;

export function HomeTemplate({ data: dataOverride }: HomeTemplateProps) {
  const router = useRouter();
  const { accountData } = useAuth();

  // Creating a library is gated by the `can-create-library` feature flag from
  // GET /api/users/me — the same gate the user dropdown's "Create library" item
  // uses. A library has no standalone create step: it's bootstrapped on the
  // owner's own page, so the button just routes there when the flag is present.
  const canCreateLibrary =
    accountData?.featureNames?.includes('can-create-library') ?? false;

  // A user may create at most one library, so the button is also disabled once
  // they already own one. Check via the owner-scoped lookup the library page
  // uses, not the home grid (which is paginated and may not include theirs).
  const [hasLibrary, setHasLibrary] = useState(false);
  useEffect(() => {
    if (!accountData?.id) {
      setHasLibrary(false);
      return;
    }
    let cancelled = false;
    getMyLibrary(accountData.id).then(lib => {
      if (!cancelled) setHasLibrary(lib !== null);
    });
    return () => {
      cancelled = true;
    };
  }, [accountData?.id]);

  const createDisabled = !canCreateLibrary || hasLibrary;

  const handleCreateLibrary = () => {
    if (createDisabled || !accountData?.username) return;
    router.push(`/library/${accountData.username}`);
  };

  const [value, setValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [remoteItems, setRemoteItems] = useState<HomeLibraryCardView[]>([]);
  const [remotePageCount, setRemotePageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(!dataOverride);

  const isControlled = dataOverride !== undefined;

  // Debounce the raw input so each keystroke doesn't fire a request.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(value.trim()), 300);
    return () => clearTimeout(timer);
  }, [value]);

  // A new query changes the result set, so jump back to the first page.
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    if (isControlled) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      const response = await getLibrariesPaginated(
        currentPage,
        perPage,
        debouncedQuery,
      );
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
  }, [isControlled, currentPage, debouncedQuery]);

  const { totalPages, currentLibraries } = useMemo(() => {
    if (isControlled) {
      const all = dataOverride ?? [];
      const q = debouncedQuery.toLowerCase();
      const data = q
        ? all.filter(lib =>
            [lib.username, lib.libraryName]
              .filter(Boolean)
              .some(field => field!.toLowerCase().includes(q)),
          )
        : all;
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
  }, [
    isControlled,
    dataOverride,
    debouncedQuery,
    currentPage,
    remoteItems,
    remotePageCount,
  ]);

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
        <div className={styles.bannerInner}>
          <InteractiveCover
            className={styles.image}
            src="/assets/library/library.png"
            wideSrc="/assets/library/library-wide.png"
            ultraWideSrc="/assets/library/library-ultrawide.png"
            alt="Keep Simple library cover"
          />
          <Button
            label="What is this place?"
            onClick={modalToggler}
            type={ButtonType.Primary}
            size={ButtonSize.Wide}
            ariaLabel="What is this place modal"
            className={styles.button}
          />
        </div>
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
            <div className={styles.searchGroup}>
              <Input
                type="search"
                value={value}
                placeholder="Search everywhere"
                placeholderColor="#C4C4C4"
                onChange={changeValueHandler}
                onClear={() => setValue('')}
                wrapperClassName={styles.input}
              />
              <Button
                label="Create Library"
                ariaLabel="Create library"
                type={ButtonType.Primary}
                Icon={<PlusIcon width={14} height={14} />}
                onClick={handleCreateLibrary}
                disabled={createDisabled}
                className={styles.createButton}
              />
            </div>
          </div>

          <div className={styles.content}>
            {isLoading && !isControlled ? (
              <Text variant={TypographyVariant.TextBase}>
                Loading libraries…
              </Text>
            ) : currentLibraries.length === 0 ? (
              <Text variant={TypographyVariant.TextBase}>
                {debouncedQuery
                  ? `No libraries match “${debouncedQuery}”.`
                  : 'No libraries yet.'}
              </Text>
            ) : (
              renderLibraryCards
            )}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <Pagination count={totalPages} onChange={handlePageChange} />
            </div>
          )}
        </div>
      </section>

      {isOpen && <AboutLibraryModal onClose={modalToggler} />}
    </main>
  );
}

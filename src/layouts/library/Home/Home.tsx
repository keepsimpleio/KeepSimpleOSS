import { mapStrapiLibrariesResponseToCards } from '@utils/library/mapStrapiLibraries';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import type { HomeLibraryCardView } from '@local-types/library/library';

import { useAnimatedList } from '@hooks/library/useAnimatedList';

import {
  buildSearchHaystack,
  matchesSearchTerms,
  tokenizeQuery,
} from '@lib/library/searchMatch';

import { getLibrariesPaginated } from '@api/library/getLibrariesPaginated';
import { getMyLibrary } from '@api/library/getMyLibrary';

import LibraryMarkIcon from '@icons/library/svg/library.svg';
import PlusIcon from '@icons/library/svg/plus.svg';

import { useAuth } from '@components/Context/library/AuthContext';
import { BrushPaper } from '@components/library/atoms/BrushPaper';
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

const libraryKey = (lib: HomeLibraryCardView) => String(lib.id);

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

  // One library per user, so the control has two jobs: create the first one, or
  // open the one that exists. Both land on the owner's own page — the button
  // only changes what it promises.
  const ownsLibrary = hasLibrary && !!accountData?.username;
  const createDisabled = !canCreateLibrary || hasLibrary;
  const libraryButtonDisabled = ownsLibrary ? false : createDisabled;

  const handleLibraryButton = () => {
    if (libraryButtonDisabled || !accountData?.username) return;
    router.push(`/library/${accountData.username}`);
  };

  const [value, setValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [remoteItems, setRemoteItems] = useState<HomeLibraryCardView[]>([]);
  const [isLoading, setIsLoading] = useState(!dataOverride);

  const isControlled = dataOverride !== undefined;

  // Debounce the raw input so filtering doesn't churn on each keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(value.trim()), 300);
    return () => clearTimeout(timer);
  }, [value]);

  // A new query changes the result set, so jump back to the first page.
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery]);

  // Invite-only product: the whole set fits one request (100 is Strapi's
  // pageSize ceiling), so fetch once and run search, sort and pagination
  // client-side. Revisit if libraries ever outgrow one page.
  useEffect(() => {
    if (isControlled) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      const response = await getLibrariesPaginated(1, 100, '');
      if (cancelled) {
        return;
      }
      const base = process.env.NEXT_PUBLIC_STRAPI;
      setRemoteItems(
        response ? mapStrapiLibrariesResponseToCards(response, base) : [],
      );
      setIsLoading(false);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [isControlled]);

  const { totalPages, currentLibraries } = useMemo(() => {
    const all = isControlled ? (dataOverride ?? []) : remoteItems;
    // Same forgiving matching the library's own search box uses: case,
    // spacing, punctuation and a slipped key all still find the library.
    const terms = tokenizeQuery(debouncedQuery);
    const data = terms.length
      ? all.filter(lib =>
          matchesSearchTerms(
            buildSearchHaystack([lib.username, lib.libraryName]),
            terms,
          ),
        )
      : all;
    // Showcase order: fullest libraries first, so the first row sells the
    // feature; empty ones sink to the tail. Id keeps ties stable.
    const sorted = [...data].sort((a, b) => {
      const totalA = a.bookCount + a.videoCount + a.songCount;
      const totalB = b.bookCount + b.videoCount + b.songCount;
      if (totalB !== totalA) {
        return totalB - totalA;
      }
      return Number(a.id) - Number(b.id);
    });
    const pages = Math.max(1, Math.ceil(sorted.length / perPage));
    const startIndex = (currentPage - 1) * perPage;

    return {
      totalPages: pages,
      currentLibraries: sorted.slice(startIndex, startIndex + perPage),
    };
  }, [isControlled, dataOverride, debouncedQuery, currentPage, remoteItems]);

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
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
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

  // Cards arrive, leave and slide as the search narrows or a page turns,
  // instead of the grid being rebuilt in one frame.
  const { ref: gridRef, entries: cardEntries } = useAnimatedList(
    currentLibraries,
    libraryKey,
  );

  const renderLibraryCards = cardEntries.map(({ item, leaving }, index) => (
    <div
      key={item.id}
      className={classNames(styles.cardSlot, {
        [styles.cardLeaving]: leaving,
      })}
      data-flip-id={String(item.id)}
      data-flip-leaving={leaving ? 'true' : undefined}
      aria-hidden={leaving || undefined}
    >
      <LibraryCard
        id={item.id}
        username={item.username}
        libraryName={item.libraryName}
        description={item.description}
        bookCount={item.bookCount}
        videoCount={item.videoCount}
        songCount={item.songCount}
        avatar={item.avatar}
        coverUrls={item.coverUrls}
        // Advance the pigment across pages, not just within one, so page 2
        // doesn't open on the same colour page 1 opened on.
        accent={(currentPage - 1) * perPage + index}
      />
    </div>
  ));

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
            size={ButtonSize.Default}
            ariaLabel="What is this place modal"
            className={styles.button}
          />
        </div>
      </section>

      <section className={styles.libraries} id={sectionId}>
        <BrushPaper />
        <div className="container">
          <div className={styles.controls}>
            <span className={styles.titleWrap}>
              <Text
                className={styles.title}
                variant={TypographyVariant.TitlePrimary}
              >
                Libraries
              </Text>
            </span>
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
                label={ownsLibrary ? 'Open my library' : 'Create Library'}
                ariaLabel={ownsLibrary ? 'Open my library' : 'Create library'}
                type={ButtonType.Primary}
                Icon={
                  ownsLibrary ? (
                    <LibraryMarkIcon width={18} height={10} />
                  ) : (
                    <PlusIcon width={14} height={14} />
                  )
                }
                onClick={handleLibraryButton}
                disabled={libraryButtonDisabled}
                className={styles.createButton}
              />
            </div>
          </div>

          <div className={styles.content} ref={gridRef}>
            {isLoading && !isControlled ? (
              <Text variant={TypographyVariant.TextBase}>
                Loading libraries…
              </Text>
            ) : currentLibraries.length === 0 ? (
              <Text variant={TypographyVariant.TextBase}>
                {debouncedQuery
                  ? `No libraries match “${debouncedQuery}”.`
                  : 'No libraries yet'}
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

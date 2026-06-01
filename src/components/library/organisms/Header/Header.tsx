'use client';

import React, { JSX, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import classNames from 'classnames';

import { useAuth } from '@/context/AuthContext';
import { useGlobalState } from '@/context/GlobalStateContext';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

import { SignInModal } from '@/components/molecules/SignInModal';
import { AddShelfModal, ShelfType } from '@/components/molecules/AddShelfModal';
import { UserDropDown } from '@/components/molecules/UserDropDown';
import { TagType, Text, TypographyVariant } from '@/components/atoms/Text';
import { Button, ButtonSize, ButtonType, IconPosition } from '@/components/molecules/Button';

import { LIBRARY_SHELVES_REFETCH_EVENT, navigationData } from '@/constants/common';
import { HeaderVariant, type HeaderProps } from './Header.types';

import { PlusIcon, CloseIcon, LogoIcon, HamburgerIcon, ArrowIcon } from '@/assets/svg';

import styles from './Header.module.scss';
import { createShelf } from '@/app/api/shelf/createShelf';
import { createLibrary } from '@/app/api/library/createLibrary';
import { getLibraryIdByUsername } from '@/app/api/library/getLibraryIdByUsername';
import type { ObjectType } from '@/types/object';

const modalTypeToApi: Record<ShelfType, ObjectType> = {
  books: 'book',
  videos: 'video',
  audios: 'audio',
};

export function Header(props: HeaderProps): JSX.Element {
  const { className, variant } = props;
  const isMain = variant === HeaderVariant.Main;
  const params = useParams();
  const libraryRouteId = params?.username as string | undefined;

  const menuRef = useRef<HTMLDivElement>(null);
  const { accountData, handleLogout } = useAuth();
  const { isSidebarOpen, isGuestMode, toggleSidebar, currentShelves } = useGlobalState();
  const [selectedJumpShelfId, setSelectedJumpShelfId] = useState<number | null>(null);

  // Default to the first shelf as soon as the list lands; let the user
  // override by clicking, but don't clobber their choice when the list
  // identity changes (e.g. after a surgical mutation).
  useEffect(() => {
    if (currentShelves.length === 0) {
      setSelectedJumpShelfId(null);
      return;
    }
    setSelectedJumpShelfId((prev) =>
      prev != null && currentShelves.some((s) => s.id === prev) ? prev : currentShelves[0].id
    );
  }, [currentShelves]);

  const handleJumpTo = (shelfId: number) => {
    setSelectedJumpShelfId(shelfId);
    const el = document.getElementById(`shelf-${shelfId}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useLockBodyScroll(isOpen);
  useLockBodyScroll(isOpenModal);

  const handleDropdownChange = (value: string) => {
    if (value === 'logout') {
      handleLogout();
    }
  };

  const handleCreateShelf = async (modalShelfType: ShelfType, name: string) => {
    const type = modalTypeToApi[modalShelfType];

    // URL param is `/library/[username]`; resolve to a numeric library id.
    let libraryId: number | null = null;
    const parsed = libraryRouteId ? parseInt(libraryRouteId, 10) : NaN;
    if (Number.isFinite(parsed)) {
      libraryId = parsed;
    } else if (libraryRouteId) {
      libraryId = await getLibraryIdByUsername(libraryRouteId);
    }

    // No library yet — bootstrap one, but only if the logged-in user owns this URL
    // (you can't create a library on someone else's behalf). The lookup above
    // ensures we don't double-create: next click finds the existing library.
    if (
      !libraryId &&
      accountData?.id &&
      accountData?.username &&
      libraryRouteId &&
      accountData.username.toLowerCase() === libraryRouteId.toLowerCase()
    ) {
      libraryId = await createLibrary(accountData.id);
    }

    if (!libraryId) {
      console.warn('[Header] cannot add shelf — no library found for', libraryRouteId);
      return;
    }

    try {
      await createShelf({
        name,
        type,
        library: libraryId,
        ...(accountData?.id != null ? { owner: accountData.id } : {}),
      });
      setIsOpen(false);
      window.dispatchEvent(new CustomEvent(LIBRARY_SHELVES_REFETCH_EVENT));
    } catch (e) {
      console.error('[Header] create shelf failed', e);
    }
  };

  const openLoginModalToogler = () => {
    setIsOpenModal(!isOpenModal);
  };

  const modalToggler = () => {
    setIsOpen(!isOpen);
  };

  const openMenuToggler = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={classNames(className, styles.header, { [styles.dashboard]: !isMain })}>
      <div className={classNames(styles.wrapper, { container: isMain })}>
        <div className={classNames(styles.content)}>
          <div className={styles.burger} role="button" onClick={openMenuToggler}>
            {isOpen ? <CloseIcon /> : <HamburgerIcon />}
          </div>

          <Link href="/" className={classNames(styles.logo)}>
            <LogoIcon />
          </Link>

          <nav
            ref={menuRef}
            className={classNames(styles.navigation, { [styles.active]: isMenuOpen })}
          >
            {navigationData.map(({ label, Icon, href }) => (
              <Link key={label} href={href} className={styles.item}>
                <Icon width={23} height={12} />
                <Text className={styles.text}>{label}</Text>
              </Link>
            ))}

            <div className={styles.close} role="button" onClick={openMenuToggler}>
              <CloseIcon />
            </div>
          </nav>
          <div />
        </div>

        <UserDropDown
          accountData={accountData}
          handleDropdownChange={handleDropdownChange}
          openLoginModalToogler={openLoginModalToogler}
        />
      </div>

      <div
        role="button"
        className={classNames(styles.sidebar, { [styles.open]: isSidebarOpen })}
        onClick={toggleSidebar}
      >
        <ArrowIcon />
      </div>

      {!isMain && (
        <>
          <div className={styles.divider} />

          <div className={classNames(styles.controls, { [styles.guest]: isGuestMode })}>
            {!isGuestMode ? (
              <>
                <Text className={styles.text}>Jump to →</Text>
                <div className={styles.jumpButtons}>
                  {currentShelves.map((shelf) => {
                    const isSelected = shelf.id === selectedJumpShelfId;
                    return (
                      <Button
                        key={shelf.id}
                        label={shelf.attributes.name}
                        ariaLabel={`Jump to ${shelf.attributes.name}`}
                        onClick={() => handleJumpTo(shelf.id)}
                        type={ButtonType.Secondary}
                        size={ButtonSize.Default}
                        className={classNames(styles.jumpButton, {
                          [styles.jumpSelected]: isSelected,
                        })}
                      />
                    );
                  })}
                </div>
                <div>
                  <Button
                    label="Reorder"
                    ariaLabel="Reorder"
                    onClick={() => {}}
                    type={ButtonType.Text}
                    size={ButtonSize.Default}
                    className={styles.button}
                  />

                  <Button
                    label="Add shelf"
                    ariaLabel="Add shelf"
                    onClick={modalToggler}
                    type={ButtonType.Text}
                    size={ButtonSize.Default}
                    Icon={<PlusIcon />}
                    iconPosition={IconPosition.Right}
                    className={styles.button}
                  />
                </div>
              </>
            ) : (
              <>
                <Text tag={TagType.H2} variant={TypographyVariant.TitleSecondaryBold}>
                  Welcome to Bryan’s hive
                </Text>
                <Text>
                  Discover and explore curated collections on Brain and Psychology, along with an
                  incredible playlist full of his favorite songs.
                </Text>
              </>
            )}
          </div>
        </>
      )}

      {isOpen && <AddShelfModal onClose={modalToggler} onAddShelf={handleCreateShelf} />}
      {isOpenModal && <SignInModal onClose={openLoginModalToogler} />}
    </header>
  );
}

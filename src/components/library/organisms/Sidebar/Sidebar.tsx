import {
  countObjectsByType,
  mapStrapiLibrariesResponseToCards,
} from '@utils/library/mapStrapiLibraries';
import { resolveStrapiUrl } from '@utils/library/resolveStrapiUrl';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import {
  KEEPSIMPLE_URL,
  LIBRARY_SHELVES_REFETCH_EVENT,
} from '@constants/library/common';

import { ITagAttributes } from '@local-types/library/tag';

import { getMyLibrary } from '@api/library/getMyLibrary';
import { createTag, CreateTagRequest } from '@api/library/tag/createTag';
import { deleteTag } from '@api/library/tag/deleteTag';
import { getTagsList } from '@api/library/tag/getTagsList';
import { updateTag, UpdateTagRequest } from '@api/library/tag/updateTag';

import avatarImage from '@icons/library/images/avatar.png';
import { CloseIcon, CopyIcon, EditIcon, PlusIcon } from '@icons/library/svg';

import { useAuth } from '@components/Context/library/AuthContext';
import { useDashboard } from '@components/Context/library/DashboardContext';
import { useGlobalState } from '@components/Context/library/GlobalStateContext';
import { Avatar } from '@components/library/atoms/Avatar';
import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { Toggle } from '@components/library/atoms/Toggle';
import { Tooltip } from '@components/library/atoms/Tooltip';
import {
  Button,
  ButtonSize,
  ButtonType,
  IconPosition,
} from '@components/library/molecules/Button';
import {
  CreateTagFormData,
  CreateTagModal,
} from '@components/library/molecules/CreateTagModal';
import { Dropdown } from '@components/library/molecules/Dropdown';
import { Input } from '@components/library/molecules/Input';
import { Object, ObjectType } from '@components/library/molecules/Object';
import { Tag } from '@components/library/molecules/Tag';
import { EditLibraryModal } from '@components/library/organisms/EditLibraryModal';

import styles from './Sidebar.module.scss';

// aboutMe / aboutLibrary come back as CKEditor rich-text HTML; strip tags for
// the sidebar display until a styled rich-text renderer is in place.
const stripHtml = (s?: string | null) =>
  s
    ?.replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim() ?? '';

export function Sidebar() {
  const router = useRouter();
  const pathname = router.asPath;

  const { accountData } = useAuth();
  const { tags, setTags } = useDashboard();
  const {
    isSidebarOpen,
    isGuestMode,
    toggleSidebar,
    toggleGuestMode,
    libraries,
    currentShelves,
    currentOwner,
    currentLibrary,
    isCreateBlocked,
  } = useGlobalState();

  const currentLibraryId = pathname?.split('/').pop() || '';

  // Share the link to the library being viewed (`/library/[username]`) on the
  // current environment's host (NEXT_PUBLIC_DOMAIN — localhost in dev, the real
  // domain in prod) rather than a hardcoded URL. Falls back to keepsimple.io if
  // the env var is unset, and to the bare host when there's no library slug.
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN ?? KEEPSIMPLE_URL;
  const shareUrl = currentLibraryId
    ? `${baseUrl}/library/${currentLibraryId}`
    : baseUrl;

  const libraryCards = useMemo(() => {
    if (!libraries || !Array.isArray(libraries.data)) {
      return [];
    }

    return mapStrapiLibrariesResponseToCards(
      libraries,
      process.env.NEXT_PUBLIC_STRAPI,
    );
  }, [libraries]);

  const [isOpenTagModal, setIsOpenTagModal] = useState<
    null | 'create' | 'edit'
  >(null);
  const [selectedTag, setSelectedTag] = useState<ITagAttributes | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditLibraryOpen, setIsEditLibraryOpen] = useState(false);
  const [selectedLibraryId, setSelectedLibraryId] = useState(
    currentLibraryId ||
      (libraryCards[0]
        ? (libraryCards[0].username ?? String(libraryCards[0].id))
        : ''),
  );

  // Object totals always come from the live shelves of the library on screen
  // (`currentShelves`, published by LibraryTemplate) — never from the viewer's
  // own library list, which would show the wrong counts on someone else's page.
  const { bookCount, videoCount, songCount } = useMemo(
    () => countObjectsByType(currentShelves),
    [currentShelves],
  );

  // The whole panel is decided by one question: is this my library, and am I
  // logged in? Yes → editable, showing my account identity. No (someone else's
  // library, or logged out) → read-only, showing the viewed library's public
  // data. Guest mode lets an owner preview that read-only view.
  //
  // Ownership matches the loaded owner against my account by any reliable
  // signal: account id (most specific, but `/api/users/me` and the library's
  // `user` relation don't always share an id space), then username, then the
  // URL slug for the window before the owner relation resolves. Matching on
  // `currentOwner` is safe from cross-page bleed because LibraryTemplate nulls
  // the previous library on navigation, so this never reflects a prior owner.
  const viewerUsername = accountData?.username?.toLowerCase() ?? null;
  const viewerId = accountData?.id != null ? String(accountData.id) : null;
  const isMyLibrary =
    (!!viewerId || !!viewerUsername) &&
    ((!!viewerId &&
      currentOwner?.id != null &&
      String(currentOwner.id) === viewerId) ||
      (!!viewerUsername &&
        (currentOwner?.username?.toLowerCase() === viewerUsername ||
          currentLibraryId.toLowerCase() === viewerUsername)));
  const canEdit = isMyLibrary && !isGuestMode;

  // An owner can edit their About panel before any library row exists — the
  // row is created lazily on first save. So the editable affordance is gated on
  // the `can-create-library` permission, not on a loaded library (the same flag
  // LibraryTemplate uses to allow bootstrapping via the first shelf).
  const canCreateLibrary =
    accountData?.featureNames?.includes('can-create-library') ?? false;
  const canEditLibrary = canEdit && (!!currentLibrary || canCreateLibrary);

  // Identity, bio and avatar all read from the viewed library's public data
  // (`currentOwner` + `currentLibrary.avatar`). For my own library that *is* my
  // data; for a visitor the populated `user` relation is hidden from the public
  // role, so fall back to the URL slug for the name (`/library/[username]`) and
  // to my account name/photo when it's mine.
  const slugName = /^\d+$/.test(currentLibraryId) ? '' : currentLibraryId;
  const authorName = isMyLibrary
    ? accountData?.username || currentOwner?.username || 'Anonymous'
    : currentOwner?.username || slugName || 'Anonymous';
  const authorAvatarUrl =
    resolveStrapiUrl(currentOwner?.avatar) ??
    (isMyLibrary ? accountData?.picture : undefined);
  const aboutAuthorText = stripHtml(currentOwner?.aboutMe);

  // Owner sees their full, editable tag palette; a visitor sees the tags
  // actually used on this library's objects — no cross-account tag fetch.
  const libraryTags = useMemo(() => {
    const byName = new Map<string, { name: string; color: string }>();
    for (const shelf of currentShelves) {
      for (const obj of shelf.attributes.objects?.data ?? []) {
        for (const tag of obj.attributes.tags?.data ?? []) {
          byName.set(tag.attributes.name, tag.attributes);
        }
      }
    }
    return Array.from(byName.values());
  }, [currentShelves]);

  const displayedTags = canEdit
    ? tags.map(t => ({ name: t.attributes.name, color: t.attributes.color }))
    : libraryTags;

  const dropdownOptions = libraryCards.map(lib => ({
    // Navigate by the URL slug (username) — the route is /library/[username].
    // Fall back to the numeric id only when a library has no linked username.
    value: lib.username ?? String(lib.id),
    label: lib.libraryName,
  }));

  const handleLibraryChange = (libraryId: string) => {
    setSelectedLibraryId(libraryId);
    toggleSidebar();
    router.push(`/library/${libraryId}`);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleCreateTag = async (formData: CreateTagFormData) => {
    try {
      if (!accountData?.id) return;

      // Strapi enforces unique slugs; a timestamp suffix keeps two tags whose
      // names normalize to the same string from colliding on write.
      const slug = `${formData.name.toLowerCase()}-${Date.now()}`;
      const body: CreateTagRequest = {
        name: formData.name,
        description: formData.description,
        color: formData.color,
        user: accountData?.id,
        slug,
      };

      await createTag(body);
      const { data } = await getTagsList();

      setTags(data);
    } catch (error) {
      console.error('Failed to create or refresh tags:', error);
      throw error;
    }
  };

  const handleEditTag = async (formData: CreateTagFormData) => {
    try {
      if (!selectedTag || !accountData?.id) return;

      const slug = `${formData.name.toLowerCase()}-${Date.now()}`;
      const body: UpdateTagRequest = {
        name: formData.name,
        description: formData.description,
        color: formData.color,
        user: accountData?.id,
        slug,
      };

      await updateTag(selectedTag.id, body);
      const { data } = await getTagsList();

      setTags(data);
      setIsOpenTagModal(null);
      setSelectedTag(null);
    } catch (error) {
      console.error('Failed to edit tag:', error);
      throw error;
    }
  };

  const handleDeleteTag = async () => {
    if (!selectedTag) return;

    try {
      await deleteTag(selectedTag.id);
      const { data } = await getTagsList();

      setTags(data);
      setIsOpenTagModal(null);
      setSelectedTag(null);
    } catch (error) {
      console.error('Failed to delete tag:', error);
      throw error;
    }
  };

  useEffect(() => {
    const idFromPath = pathname?.split('/').pop() || '';

    if (idFromPath) {
      setSelectedLibraryId(idFromPath);
    }
  }, [pathname]);

  useEffect(() => {
    if (selectedLibraryId || libraryCards.length === 0) {
      return;
    }

    setSelectedLibraryId(
      libraryCards[0].username ?? String(libraryCards[0].id),
    );
  }, [libraryCards, selectedLibraryId]);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  // Load the tag list on mount. `setTags` is otherwise only called after a
  // create/edit/delete, so without this the Tags panel renders empty on every
  // fresh page load until the user mutates a tag.
  useEffect(() => {
    let cancelled = false;
    getTagsList().then(({ data }) => {
      if (!cancelled) setTags(data);
    });
    return () => {
      cancelled = true;
    };
  }, [setTags]);

  // TEMP DEBUG: verify whether the authenticated `filters[user][id]` relation
  // query actually resolves the owner's library in the browser (it 500s for the
  // public role). Remove once the backend exposes `user` on /api/libraries.
  useEffect(() => {
    if (!accountData?.id) {
      console.log('[myLibrary debug] no accountData.id yet', { accountData });
      return;
    }
    getMyLibrary(accountData.id).then(lib => {
      console.log('[myLibrary debug] getMyLibrary result', {
        accountId: accountData.id,
        username: accountData.username,
        myLibrary: lib,
      });
    });
  }, [accountData?.id, accountData?.username, accountData]);

  // Hide the right panel entirely when the owner lacks permission to create a
  // library — the page shows only the centered no-permission message.
  if (isCreateBlocked) return null;

  return (
    <>
      <aside
        className={classNames(styles.sidebar, {
          [styles.open]: isSidebarOpen,
        })}
      >
        <div className={styles.close}>
          <Button
            onClick={toggleSidebar}
            type={ButtonType.Text}
            size={ButtonSize.Default}
            ariaLabel="Close"
            Icon={<CloseIcon />}
          />
        </div>

        <div className={styles.dropdownWrapper}>
          <Dropdown
            options={dropdownOptions}
            value={selectedLibraryId}
            onChange={handleLibraryChange}
            placeholder="Select library"
            ariaLabel="Select library"
            className={styles.dropdown}
          />
        </div>

        <div className={styles.main}>
          <div className={styles.about}>
            <div className={styles.header}>
              <Text className={styles.label}>About</Text>
              {canEditLibrary && (
                <Button
                  label="Edit"
                  onClick={() => setIsEditLibraryOpen(true)}
                  type={ButtonType.Secondary}
                  size={ButtonSize.Default}
                  ariaLabel="Edit library"
                  Icon={<EditIcon />}
                  className={styles.button}
                  labelClassName={styles.text}
                />
              )}
            </div>

            <div className={styles.content}>
              <div>
                <Text className={styles.label}>
                  {currentLibrary?.attributes.libraryDetails?.aboutLibrary ??
                    ''}
                </Text>
              </div>
              <div className={styles.divider} />

              <div className={styles.totalObjects}>
                <Text className={styles.label}>Total objects:</Text>
                <div className={styles.objects}>
                  <Object
                    className={styles.count}
                    type={ObjectType.Book}
                    number={bookCount}
                    noBorder
                  />
                  <Object
                    className={styles.count}
                    type={ObjectType.Video}
                    number={videoCount}
                    noBorder
                  />
                  <Object
                    className={styles.count}
                    type={ObjectType.Audio}
                    number={songCount}
                    noBorder
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.about}>
            <div className={styles.header}>
              <Text className={styles.label}>Author</Text>
            </div>

            <div className={styles.content}>
              <div className={styles.avatar}>
                <Avatar
                  url={authorAvatarUrl ?? avatarImage}
                  className={styles.avatarImage}
                />
                <Text
                  className={styles.name}
                  variant={TypographyVariant.TextBaseBold}
                >
                  {authorName}
                </Text>
              </div>
              <Text className={styles.text}>
                {aboutAuthorText || 'No bio yet.'}
              </Text>
            </div>
          </div>

          <div className={styles.about}>
            <div className={styles.header}>
              <Text className={styles.label}>Tags</Text>
              {canEdit && (
                <Button
                  label="Edit"
                  ariaLabel="Edit"
                  onClick={() => {
                    setIsOpenTagModal('edit');
                  }}
                  type={ButtonType.Secondary}
                  size={ButtonSize.Default}
                  Icon={<EditIcon />}
                  className={styles.button}
                  labelClassName={styles.text}
                />
              )}
            </div>
            <div className={styles.content}>
              <div className={styles.tags}>
                {displayedTags.map(tag => (
                  <Tag key={tag.name} label={tag.name} color={tag.color} />
                ))}
                {canEdit && (
                  <Button
                    label="Create Tag"
                    ariaLabel="Create Tag"
                    onClick={() => setIsOpenTagModal('create')}
                    type={ButtonType.Text}
                    size={ButtonSize.Default}
                    Icon={<PlusIcon />}
                    iconPosition={IconPosition.Right}
                    className={styles.button}
                    labelClassName={styles.text}
                  />
                )}
              </div>
            </div>
          </div>

          <div className={styles.about}>
            <div className={styles.header}>
              <Text className={styles.label}>
                Share (Including selected objects)
              </Text>
            </div>
            <div className={styles.content}>
              <div className={styles.shareInputContainer}>
                <Input
                  type="text"
                  value={shareUrl}
                  placeholder=""
                  onChange={() => {}}
                  disabled
                  wrapperClassName={styles.shareInputWrapper}
                  className={styles.shareInput}
                  ariaLabel="Share URL"
                />
                <Tooltip
                  place="top"
                  tooltipContent={isCopied ? 'Copied!' : 'Click to copy'}
                >
                  <Button
                    label=""
                    onClick={handleCopyUrl}
                    type={ButtonType.Secondary}
                    size={ButtonSize.Default}
                    ariaLabel="Copy URL"
                    Icon={<CopyIcon />}
                    className={`${styles.copyButton} ${isCopied ? styles.copied : ''}`}
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Text className={styles.label}>Guest mode</Text>
          <Toggle
            checked={isGuestMode}
            onChange={toggleGuestMode}
            ariaLabel="Guest mode"
          />
        </div>
      </aside>
      {isOpenTagModal && (
        <CreateTagModal
          isEdit={isOpenTagModal === 'edit'}
          activeTag={selectedTag || undefined}
          tags={tags}
          onDelete={handleDeleteTag}
          onClose={() => {
            setIsOpenTagModal(null);
            setSelectedTag(null);
          }}
          onTagSelect={setSelectedTag}
          onSubmit={
            isOpenTagModal === 'create' ? handleCreateTag : handleEditTag
          }
        />
      )}
      {isEditLibraryOpen && canEditLibrary && (
        <EditLibraryModal
          library={currentLibrary}
          onClose={() => setIsEditLibraryOpen(false)}
          onSaved={libraryId => {
            setIsEditLibraryOpen(false);
            // Reload the viewed library so the panel (avatar/bio/name) reflects
            // the save; LibraryTemplate re-publishes currentLibrary/currentOwner.
            // Carry the resolved id so a just-bootstrapped library loads by a
            // direct GET instead of the restricted owner relation-filter.
            window.dispatchEvent(
              new CustomEvent(LIBRARY_SHELVES_REFETCH_EVENT, {
                detail: { libraryId },
              }),
            );
          }}
        />
      )}
    </>
  );
}

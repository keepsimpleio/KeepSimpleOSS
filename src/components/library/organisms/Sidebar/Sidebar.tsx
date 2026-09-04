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

import { createTag, CreateTagRequest } from '@api/library/tag/createTag';
import { deleteTag } from '@api/library/tag/deleteTag';
import { getTagsList } from '@api/library/tag/getTagsList';
import { updateTag, UpdateTagRequest } from '@api/library/tag/updateTag';

import avatarImage from '@icons/library/images/avatar.png';
import {
  CloseIcon,
  CopyIcon,
  EditIcon,
  InfoIcon,
  PlusIcon,
} from '@icons/library/svg';

import { useAuth } from '@components/Context/library/AuthContext';
import { useDashboard } from '@components/Context/library/DashboardContext';
import { useGlobalState } from '@components/Context/library/GlobalStateContext';
import { Avatar } from '@components/library/atoms/Avatar';
import { InkLine } from '@components/library/atoms/InkLine';
import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { Toggle } from '@components/library/atoms/Toggle';
import { Tooltip } from '@components/library/atoms/Tooltip';
import {
  Button,
  ButtonSize,
  ButtonType,
} from '@components/library/molecules/Button';
import {
  CreateTagFormData,
  CreateTagModal,
} from '@components/library/molecules/CreateTagModal';
import { Dropdown } from '@components/library/molecules/Dropdown';
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

  const { accountData } = useAuth();
  const { tags, setTags } = useDashboard();
  const {
    isSidebarOpen,
    isGuestMode,
    toggleSidebar,
    closeSidebar,
    toggleGuestMode,
    libraries,
    currentShelves,
    currentOwner,
    currentLibrary,
    isCreateBlocked,
    isOwner,
  } = useGlobalState();

  // The library being viewed is always the `[username]` route segment — read it
  // from the router params, not the URL tail. On nested routes
  // (`/library/[username]/[slug]`, `/library/[username]/share/[token]`) the tail
  // is the object slug or share token, not the library.
  const usernameParam = router.query.username;
  const currentLibraryId =
    (Array.isArray(usernameParam) ? usernameParam[0] : usernameParam) ?? '';

  // Share the link to the library being viewed (`/library/[username]`) on the
  // current environment's host (NEXT_PUBLIC_DOMAIN — localhost in dev, the real
  // domain in prod) rather than a hardcoded URL. Falls back to keepsimple.io if
  // the env var is unset, and to the bare host when there's no library slug.
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN ?? KEEPSIMPLE_URL;
  const shareUrl = currentLibraryId
    ? `${baseUrl}/library/${encodeURIComponent(currentLibraryId)}`
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
  // Those shelves are already the ones the viewer may see (private ones are
  // filtered out for visitors and in guest mode), so count all of them.
  const { bookCount, videoCount, songCount } = useMemo(
    () => countObjectsByType(currentShelves, { includePrivate: true }),
    [currentShelves],
  );

  // The whole panel is decided by one question: is this my library, and am I
  // logged in? Yes → editable, showing my account identity. No (someone else's
  // library, or logged out) → read-only, showing the viewed library's public
  // data. Guest mode lets an owner preview that read-only view.
  //
  // The answer is not computed here. LibraryTemplate decides ownership once
  // and publishes it, so this panel and the shelves can never disagree about
  // who is looking (they used to, on a numeric `/library/123` address).
  const isMyLibrary = isOwner;
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
  const authorName = canEdit
    ? accountData?.username || currentOwner?.username || 'Anonymous'
    : currentOwner?.username || slugName || 'Anonymous';
  const authorAvatarUrl =
    resolveStrapiUrl(currentOwner?.avatar) ??
    (canEdit ? accountData?.picture : undefined);
  const aboutAuthorText = stripHtml(currentOwner?.aboutMe);
  const aboutLibraryText = stripHtml(
    currentLibrary?.attributes.libraryDetails?.aboutLibrary,
  );

  // Owner sees their full tag palette; a true visitor sees only the tags
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

  // The owner's full palette is theirs to see; guest mode is a faithful
  // preview, so it shows exactly what a visitor gets: the tags in use.
  const displayedTags = canEdit
    ? tags.map(t => ({ name: t.attributes.name, color: t.attributes.color }))
    : libraryTags;

  const dropdownOptions = libraryCards.map(lib => ({
    // Navigate by the URL slug (username) — the route is /library/[username].
    // Fall back to the numeric id only when a library has no linked username.
    value: lib.username ?? String(lib.id),
    label: lib.libraryName,
  }));

  // The address may spell the username in another case, or carry the numeric
  // id instead: resolve it to the option it means, so the trigger shows the
  // library you are standing in rather than "Select library".
  const dropdownValue = useMemo(() => {
    const wanted = selectedLibraryId.toLowerCase();
    const match = libraryCards.find(
      lib =>
        (lib.username ?? '').toLowerCase() === wanted ||
        String(lib.id) === wanted,
    );
    return match ? (match.username ?? String(match.id)) : selectedLibraryId;
  }, [libraryCards, selectedLibraryId]);

  const handleLibraryChange = (libraryId: string) => {
    setSelectedLibraryId(libraryId);
    closeSidebar();
    router.push(`/library/${encodeURIComponent(libraryId)}`);
  };

  const [copyError, setCopyError] = useState<string | null>(null);
  const handleCopyUrl = async () => {
    setCopyError(null);
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
    } catch {
      // Clipboard API is unavailable on insecure origins / older browsers —
      // fall back to a throwaway textarea + execCommand, as the overview's
      // Share button does; failing that, say so instead of a silent click.
      try {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (!ok) throw new Error('execCommand failed');
        setIsCopied(true);
      } catch {
        setCopyError('Could not copy. Select the link and copy it by hand.');
      }
    }
  };

  // Tags live on shelf cards and in the search index as well as in this
  // panel, so a rename, recolour or delete reloads the library too.
  const refetchLibrary = () => {
    window.dispatchEvent(new CustomEvent(LIBRARY_SHELVES_REFETCH_EVENT));
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
      const { data } = await getTagsList(accountData.id);

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
      const { data } = await getTagsList(accountData.id);

      setTags(data);
      refetchLibrary();
      setIsOpenTagModal(null);
      setSelectedTag(null);
    } catch (error) {
      console.error('Failed to edit tag:', error);
      throw error;
    }
  };

  const handleDeleteTag = async () => {
    if (!selectedTag || !accountData?.id) return;

    try {
      await deleteTag(selectedTag.id);
      const { data } = await getTagsList(accountData.id);

      setTags(data);
      refetchLibrary();
      setIsOpenTagModal(null);
      setSelectedTag(null);
    } catch (error) {
      console.error('Failed to delete tag:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (currentLibraryId) {
      setSelectedLibraryId(currentLibraryId);
    }
  }, [currentLibraryId]);

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
    getTagsList(accountData?.id).then(({ data }) => {
      if (!cancelled) setTags(data);
    });
    return () => {
      cancelled = true;
    };
  }, [setTags, accountData?.id]);

  // Hide the right panel entirely when the owner lacks permission to create a
  // library — the page shows only the centered no-permission message.
  if (isCreateBlocked) return null;

  return (
    <>
      {/* Mobile-only fallback opener. The toolbar carries the About button
          beside the library name, but the toolbar only exists once the library
          has shelves — an empty library would otherwise have no way in. The
          backdrop taps the drawer closed. Both are hidden on desktop, where the
          panel is a static sticky column. */}
      {!isSidebarOpen && currentShelves.length === 0 && (
        <button
          type="button"
          className={styles.openTab}
          onClick={toggleSidebar}
          aria-label="Open library info panel"
        >
          <InfoIcon />
        </button>
      )}
      {isSidebarOpen && (
        <div
          className={styles.backdrop}
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
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
            value={dropdownValue}
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
                {/* Plain text: the field is CKEditor markup server-side, and
                    printing it raw showed the tags. Empty gets a line of its
                    own, like Author and Tags do. */}
                <Text
                  className={classNames(styles.label, {
                    [styles.emptyTags]: !aboutLibraryText,
                  })}
                >
                  {aboutLibraryText ||
                    (canEditLibrary
                      ? 'No description yet. Add one with Edit.'
                      : 'No description yet.')}
                </Text>
              </div>
              <InkLine seed={7} className={styles.innerRule} />

              <div className={styles.totalObjects}>
                <Text className={styles.subLabel}>Content</Text>
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
            <InkLine seed={1} className={styles.sectionRule} />
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
            <InkLine seed={2} className={styles.sectionRule} />
          </div>

          <div className={styles.about}>
            <div className={styles.header}>
              <Text className={styles.label}>Tags</Text>
              {/* Both tag controls sit in the header: a chip inside the
                  wrapping tag flow drifted every time a tag was added. */}
              {canEdit && (
                <span className={styles.headerActions}>
                  {displayedTags.length > 0 && (
                    <Button
                      label="Edit"
                      ariaLabel="Edit tags"
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
                  <Button
                    label="Create"
                    ariaLabel="Create tag"
                    onClick={() => setIsOpenTagModal('create')}
                    type={ButtonType.Secondary}
                    size={ButtonSize.Default}
                    Icon={<PlusIcon />}
                    className={styles.button}
                    labelClassName={styles.text}
                  />
                </span>
              )}
            </div>
            <div className={styles.content}>
              <div
                className={classNames(styles.tags, {
                  [styles.tagsEmpty]: displayedTags.length === 0,
                })}
              >
                {displayedTags.length === 0 && (
                  <Text className={styles.emptyTags}>No tags yet.</Text>
                )}
                {displayedTags.map(tag => (
                  <Tag key={tag.name} label={tag.name} color={tag.color} />
                ))}
              </div>
            </div>
            <InkLine seed={3} className={styles.sectionRule} />
          </div>

          <div className={styles.about}>
            <div className={styles.header}>
              {/* The address below is the library's own link, the same for
                  every visitor. Objects picked on the shelves travel by their
                  own minted link from the selection bar, and selecting is
                  owner-only — so no parenthetical here promising otherwise. */}
              <Text className={styles.label}>Share</Text>
            </div>
            <div className={styles.content}>
              {/* The address sits in a read-only field with the copy icon
                  beside it: seeing the start of the link is what tells the
                  visitor what is about to be shared. The head ellipsizes only
                  as far as the field forces it, so the library name at the end
                  stays readable; the copy button always writes the full URL. */}
              <div className={styles.shareInputContainer}>
                <input
                  className={styles.shareLinkInput}
                  type="text"
                  readOnly
                  value={shareUrl}
                  title={shareUrl}
                  aria-label="Share URL"
                  onFocus={e => e.currentTarget.select()}
                />
                {/* Both labels sit in one grid cell, so the bubble is sized by
                    the wider of the two and never resizes on click: the box and
                    its arrow stay exactly where the hover put them, and
                    "Copied!" cross-fades in place of "Click to copy". */}
                <Tooltip
                  place="top"
                  tooltipContent={
                    <span className={styles.copyTooltip}>
                      <span
                        className={`${styles.copyTooltipLabel} ${isCopied ? '' : styles.copyTooltipLabelVisible}`}
                      >
                        Click to copy
                      </span>
                      <span
                        className={`${styles.copyTooltipLabel} ${isCopied ? styles.copyTooltipLabelVisible : ''}`}
                      >
                        Copied!
                      </span>
                    </span>
                  }
                >
                  <Button
                    onClick={handleCopyUrl}
                    type={ButtonType.Secondary}
                    size={ButtonSize.Default}
                    ariaLabel={isCopied ? 'Link copied' : 'Copy URL'}
                    Icon={<CopyIcon />}
                    className={`${styles.copyButton} ${isCopied ? styles.copied : ''}`}
                  />
                </Tooltip>
              </div>
              {/* One held line: "Copied" for everyone, not only under a hover
                  tooltip, and the failure when the clipboard is unavailable. */}
              <Text
                variant={TypographyVariant.TextSmall}
                className={classNames(styles.copyStatus, {
                  [styles.copyStatusError]: !!copyError,
                })}
                aria-live="polite"
              >
                {copyError ?? (isCopied ? 'Link copied.' : '')}
              </Text>
            </div>
          </div>
        </div>

        {isMyLibrary && (
          <div
            className={classNames(styles.footer, {
              [styles.footerActive]: isGuestMode,
            })}
          >
            <div className={styles.footerText}>
              <Text className={styles.label}>Guest mode</Text>
              <Text
                variant={TypographyVariant.TextSmall}
                className={styles.footerHint}
              >
                {isGuestMode
                  ? 'You are seeing this library as a visitor. Switch off to edit.'
                  : 'See this library exactly as a visitor does.'}
              </Text>
            </div>
            <Toggle
              checked={isGuestMode}
              onChange={toggleGuestMode}
              ariaLabel="Guest mode"
            />
          </div>
        )}
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

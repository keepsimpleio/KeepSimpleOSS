import { mapStrapiLibrariesResponseToCards } from '@utils/library/mapStrapiLibraries';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo,useState } from 'react';

import { KEEPSIMPLE_URL } from '@constants/library/common';

import type {
  ILibrary,
  StrapiLibrariesResponse,
} from '@local-types/library/library';
import { ITagAttributes } from '@local-types/library/tag';

import { getMyLibrary } from '@api/library/library/getMyLibrary';
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
  } = useGlobalState();

  const currentLibraryId = pathname?.split('/').pop() || '';

  const libraryCards = useMemo(() => {
    if (!libraries || typeof libraries !== 'object' || !('data' in libraries)) {
      return [];
    }

    const res = libraries as StrapiLibrariesResponse;

    if (!Array.isArray(res.data)) {
      return [];
    }

    return mapStrapiLibrariesResponseToCards(
      res,
      process.env.NEXT_PUBLIC_STRAPI,
    );
  }, [libraries]);

  const [isOpenTagModal, setIsOpenTagModal] = useState<
    null | 'create' | 'edit'
  >(null);
  const [selectedTag, setSelectedTag] = useState<ITagAttributes | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditLibraryOpen, setIsEditLibraryOpen] = useState(false);
  const [myLibrary, setMyLibrary] = useState<ILibrary | null>(null);
  const [selectedLibraryId, setSelectedLibraryId] = useState(
    currentLibraryId || (libraryCards[0] ? String(libraryCards[0].id) : ''),
  );

  const selectedLibrary =
    libraryCards.find(lib => String(lib.id) === selectedLibraryId) ??
    libraryCards[0] ??
    null;

  const bookCount = selectedLibrary?.bookCount ?? 0;
  const videoCount = selectedLibrary?.videoCount ?? 0;
  const songCount = selectedLibrary?.songCount ?? 0;

  const authorName = accountData?.username || accountData?.name || 'Anonymous';
  const authorAvatarUrl = accountData?.picture;
  const aboutAuthorText = stripHtml(myLibrary?.attributes.aboutMe);

  const dropdownOptions = libraryCards.map(lib => ({
    value: String(lib.id),
    label: lib.libraryName,
  }));

  const handleLibraryChange = (libraryId: string) => {
    setSelectedLibraryId(libraryId);
    toggleSidebar();
    router.push(`/library/${libraryId}`);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(KEEPSIMPLE_URL);
      setIsCopied(true);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleCreateTag = async (formData: CreateTagFormData) => {
    try {
      if (!accountData?.id) return;

      const slug = `${formData.name.toLowerCase()}-1`;
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

      const slug = `${formData.name.toLowerCase()}-1`;
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

    setSelectedLibraryId(String(libraryCards[0].id));
  }, [libraryCards, selectedLibraryId]);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  // Auto-detect the user's library on mount so the Edit button works after refresh.
  useEffect(() => {
    if (!accountData?.id || myLibrary) return;
    let cancelled = false;
    (async () => {
      const lib = await getMyLibrary(accountData.id as string);
      if (!cancelled && lib) {
        setMyLibrary(lib);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accountData?.id, myLibrary]);

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
              {!isGuestMode && myLibrary && (
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
                  {selectedLibrary?.description ?? ''}
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
              {!isGuestMode && (
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
                {tags.map(({ attributes }) => (
                  <Tag
                    key={attributes.name}
                    label={attributes.name}
                    color={attributes.color}
                  />
                ))}
                {!isGuestMode && (
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
                  value={KEEPSIMPLE_URL}
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
      {isEditLibraryOpen && myLibrary && (
        <EditLibraryModal
          library={myLibrary}
          onClose={() => setIsEditLibraryOpen(false)}
          onSaved={updated => setMyLibrary(updated)}
        />
      )}
    </>
  );
}

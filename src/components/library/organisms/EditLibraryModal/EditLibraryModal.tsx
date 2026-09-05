import { zodResolver } from '@hookform/resolvers/zod';
import {
  AVATAR_ACCEPT_MIME,
  AVATAR_MAX_BYTES,
  AVATAR_MIN_BYTES,
  type EditLibraryFormData,
  editLibrarySchema,
} from '@utils/library/schema/editLibrarySchema';
import axios from 'axios';
import classNames from 'classnames';
import React, { JSX, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import type { IUpdateLibraryPayload } from '@local-types/library/library';
import type { IUpdateMeErrorBody } from '@local-types/library/user';

import { createLibrary } from '@api/library/createLibrary';
import { updateLibrary } from '@api/library/updateLibrary';
import { uploadFile } from '@api/library/upload/uploadFile';
import { getUserInfo } from '@api/library/user/getUserInfo';
import { updateMe } from '@api/library/user/updateMe';

import { useAuth } from '@components/Context/library/AuthContext';
import { Avatar } from '@components/library/atoms/Avatar';
import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { Tooltip } from '@components/library/atoms/Tooltip';
import {
  Button,
  ButtonSize,
  ButtonType,
} from '@components/library/molecules/Button';
import { ConfirmationModal } from '@components/library/molecules/ConfirmationModal';
import { Input } from '@components/library/molecules/Input';
import { Modal, useModalClose } from '@components/library/molecules/Modal';
import { Textarea } from '@components/library/molecules/Textarea';

import type { EditLibraryModalProps } from './EditLibraryModal.types';

import styles from './EditLibraryModal.module.scss';

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI ?? '';

// Strapi returns relative URLs (`/uploads/...`) for files hosted on the
// Strapi server itself; external providers return absolute URLs. Prefix when needed.
function absoluteUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  return url.startsWith('http') ? url : `${STRAPI_BASE}${url}`;
}

function readUsernameError(
  body: IUpdateMeErrorBody | undefined,
): string | undefined {
  if (!body?.message) return undefined;
  if (typeof body.message === 'string') return body.message;
  return body.message.username ?? body.message.error;
}

// aboutMe / aboutLibrary are CKEditor rich-text fields server-side; until we
// swap the plain Textarea for a rich-text editor, strip tags on display and
// send plain text back. CKEditor will wrap on its own when edited via admin.
const stripHtml = (s?: string | null) =>
  s
    ?.replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim() ?? '';

export function EditLibraryModal(props: EditLibraryModalProps): JSX.Element {
  const { className, library, onClose, onSaved } = props;
  const { accountData, setAccountData } = useAuth();

  const currentAvatarUrl = absoluteUrl(
    library?.attributes.avatar?.data?.attributes.url,
  );
  const currentAboutMe = stripHtml(library?.attributes.aboutMe);
  const currentAboutLibrary = stripHtml(
    library?.attributes.libraryDetails?.aboutLibrary,
  );
  const currentUsername = accountData?.username ?? '';

  // Avatar state — tri-state: untouched (null), replaced (File), removed (true).
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [topError, setTopError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  // Synchronous twin of `isSaving`: a second click fired before the
  // re-render that disables the button must not start a second save.
  const saveInFlightRef = useRef(false);
  const [discardPrompt, setDiscardPrompt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resolve exactly the way the Sidebar's Author block does: the library's own
  // upload wins, and the owner's account photo stands in until they upload one.
  // Without the fallback the modal showed the empty placeholder while the panel
  // behind it showed the account photo, so the owner was told they had no
  // picture while looking at one.
  const previewUrl = useMemo(() => {
    if (avatarFile) return URL.createObjectURL(avatarFile);
    if (!avatarRemoved && currentAvatarUrl) return currentAvatarUrl;
    return accountData?.picture;
  }, [avatarFile, avatarRemoved, currentAvatarUrl, accountData?.picture]);

  // The account photo is a stand-in this modal does not own, so it is not
  // something "Remove picture" can act on — only a real library avatar (or a
  // file picked in this session) is removable.
  const canRemovePicture =
    avatarFile !== null || (!avatarRemoved && Boolean(currentAvatarUrl));

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty: formDirty },
  } = useForm<EditLibraryFormData>({
    resolver: zodResolver(editLibrarySchema),
    defaultValues: {
      username: currentUsername,
      aboutMe: currentAboutMe,
      aboutLibrary: currentAboutLibrary,
    },
  });

  const aboutMeValue = watch('aboutMe') ?? '';
  const aboutLibraryValue = watch('aboutLibrary') ?? '';
  const avatarDirty = avatarFile !== null || avatarRemoved;
  const hasChanges = formDirty || avatarDirty;
  const canSave = !isSaving && hasChanges;

  // Closing with edits pending asks first.
  // A finished save leaves through the same fade as Cancel: the flag lets
  // the close past the unsaved-changes guard, which is still true until the
  // parent unmounts us with fresh data.
  const savedPending = useRef(false);
  const requestClose = () => {
    if (savedPending.current) {
      onClose();
      return;
    }
    if (isSaving) return;
    if (hasChanges) {
      setDiscardPrompt(true);
      return;
    }
    onClose();
  };
  const { closeRef, close } = useModalClose(requestClose);

  const handlePickFile = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;

    if (!AVATAR_ACCEPT_MIME.includes(file.type)) {
      setAvatarError('Avatar must be a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size < AVATAR_MIN_BYTES) {
      setAvatarError('Avatar must be at least 10 KB.');
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setAvatarError('Avatar must be 5 MB or smaller.');
      return;
    }
    setAvatarError(null);
    setAvatarFile(file);
    setAvatarRemoved(false);
  };

  const handleRemovePicture = () => {
    setAvatarFile(null);
    setAvatarRemoved(Boolean(currentAvatarUrl) || avatarFile !== null);
    setAvatarError(null);
  };

  const onSubmit = async (data: EditLibraryFormData) => {
    if (saveInFlightRef.current) return;
    saveInFlightRef.current = true;
    setTopError(null);
    setUsernameError(null);
    setIsSaving(true);

    try {
      // 1. Upload avatar first if a new file was picked — we need the id for the PUT.
      let uploadedAvatarId: number | null | undefined;
      if (avatarFile) {
        let uploaded: Awaited<ReturnType<typeof uploadFile>>;
        try {
          uploaded = await uploadFile(avatarFile);
        } catch (uploadErr) {
          // Avatar uploads straight to Strapi; an over-limit image returns 413
          // (or is dropped by the proxy, surfacing as a bare network error).
          // Show a size message on the avatar field instead of a generic error.
          const status = (uploadErr as { response?: { status?: number } })
            ?.response?.status;
          const hasResponse = !!(uploadErr as { response?: unknown })?.response;
          setAvatarError(
            status === 413 || !hasResponse
              ? 'Avatar must be 5 MB or smaller.'
              : "Couldn't upload the avatar. Please try again.",
          );
          return;
        }
        uploadedAvatarId = uploaded.id;
      } else if (avatarRemoved) {
        uploadedAvatarId = null;
      }

      // 2. Build the library PUT payload — only include changed keys.
      const libraryPayload: IUpdateLibraryPayload = {};
      if (data.aboutMe !== currentAboutMe)
        libraryPayload.aboutMe = data.aboutMe ?? '';
      if (data.aboutLibrary !== currentAboutLibrary) {
        libraryPayload.libraryDetails = {
          aboutLibrary: data.aboutLibrary ?? '',
        };
      }
      if (uploadedAvatarId !== undefined)
        libraryPayload.avatar = uploadedAvatarId;

      const hasLibraryChanges = Object.keys(libraryPayload).length > 0;

      // Bootstrap the library on first save — a permitted owner can open this
      // modal before any library row exists (the row is created lazily, the
      // same way adding the first shelf does). Only create one if there's an
      // actual library change to persist; a username-only edit needs no library.
      let libraryId = library?.id ?? null;
      if (hasLibraryChanges && libraryId == null && accountData?.id != null) {
        libraryId = await createLibrary(accountData.id);
        if (libraryId == null) {
          setTopError('Could not create your library. Please try again.');
          return;
        }
      }

      const usernameChanged = data.username !== currentUsername;

      const [libraryResult, userResult] = await Promise.allSettled([
        hasLibraryChanges && libraryId != null
          ? updateLibrary(libraryId, libraryPayload)
          : Promise.resolve(null),
        usernameChanged
          ? updateMe({ username: data.username })
          : Promise.resolve(null),
      ]);

      if (userResult.status === 'rejected') {
        const body = axios.isAxiosError(userResult.reason)
          ? (userResult.reason.response?.data as IUpdateMeErrorBody | undefined)
          : undefined;
        setUsernameError(
          readUsernameError(body) ?? 'Could not update username.',
        );
      }

      if (libraryResult.status === 'rejected') {
        setTopError('Could not update library. Please try again.');
      }

      if (
        libraryResult.status === 'rejected' ||
        userResult.status === 'rejected'
      ) {
        return; // leave the modal open so the user can fix it
      }

      // 3. Refresh accountData (username may have changed). The library is
      // reloaded by the caller via the resolved id — a direct GET by id, which
      // (unlike the owner relation-filter) reliably resolves a just-created row.
      const freshUser = await getUserInfo();
      if (freshUser) setAccountData(freshUser);
      if (libraryId != null) onSaved?.(libraryId);
      savedPending.current = true;
      close();
    } catch (error) {
      console.error('EditLibraryModal save failed:', error);
      setTopError('Something went wrong. Please try again.');
    } finally {
      saveInFlightRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <>
      <Modal
        title="Edit library"
        className={classNames(styles.modal, className)}
        onClose={requestClose}
        closeRef={closeRef}
      >
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarPreview}>
              <Avatar url={previewUrl} className={styles.avatarImage} />
            </div>
            <div className={styles.avatarButtons}>
              <Tooltip
                place="top"
                tooltipContent={
                  canRemovePicture ? '' : 'There is no picture to remove yet.'
                }
                wrapperClassName={classNames({
                  [styles.tooltipOff]: canRemovePicture,
                })}
              >
                <Button
                  label="Remove picture"
                  ariaLabel="Remove picture"
                  onClick={handleRemovePicture}
                  type={ButtonType.Secondary}
                  size={ButtonSize.Default}
                  disabled={!canRemovePicture}
                />
              </Tooltip>
              <Button
                label="Upload picture"
                ariaLabel="Upload picture"
                onClick={handlePickFile}
                type={ButtonType.Primary}
                size={ButtonSize.Default}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept={AVATAR_ACCEPT_MIME.join(',')}
                onChange={handleFileChange}
                className={styles.hiddenFile}
                tabIndex={-1}
                aria-label="Choose a picture"
              />
            </div>
            {/* The limits are stated before they bite, not only as an error. */}
            <p
              className={classNames(styles.error, {
                [styles.hint]: !avatarError,
              })}
            >
              {avatarError ?? 'JPG, PNG or WebP, between 10 KB and 5 MB.'}
            </p>
          </div>

          <div className={styles.field}>
            <Text
              variant={TypographyVariant.TextSmall}
              className={styles.label}
            >
              Username
            </Text>
            <Input
              type="text"
              ariaLabel="Username"
              placeholder="Enter your username"
              placeholderColor="#9E9E9E"
              {...register('username')}
            />
            <p className={styles.error}>
              {errors.username?.message ?? usernameError ?? ' '}
            </p>
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <Text
                variant={TypographyVariant.TextSmall}
                className={styles.label}
              >
                About library
              </Text>
              <Text
                variant={TypographyVariant.TextSmall}
                className={styles.counter}
              >
                {aboutLibraryValue.length} / 4000
              </Text>
            </div>
            <Textarea
              ariaLabel="About library"
              placeholder="What is this library about?"
              rows={4}
              className={styles.textarea}
              {...register('aboutLibrary')}
            />
            <p className={styles.error}>
              {errors.aboutLibrary?.message ?? ' '}
            </p>
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <Text
                variant={TypographyVariant.TextSmall}
                className={styles.label}
              >
                About author
              </Text>
              <Text
                variant={TypographyVariant.TextSmall}
                className={styles.counter}
              >
                {aboutMeValue.length} / 2000
              </Text>
            </div>
            <Textarea
              ariaLabel="About author"
              placeholder="Tell visitors about yourself"
              rows={4}
              className={styles.textarea}
              {...register('aboutMe')}
            />
            <p className={styles.error}>{errors.aboutMe?.message ?? ' '}</p>
          </div>

          <p className={styles.error}>{topError ?? ' '}</p>

          <div className={styles.actions}>
            <Button
              label="Cancel"
              onClick={close}
              type={ButtonType.Secondary}
              size={ButtonSize.Default}
              ariaLabel="Cancel"
              disabled={isSaving}
            />
            <Tooltip
              place="top"
              tooltipContent={hasChanges ? '' : 'Nothing has changed yet.'}
              wrapperClassName={classNames({ [styles.tooltipOff]: hasChanges })}
            >
              <Button
                label={isSaving ? 'Saving…' : 'Save'}
                buttonType="submit"
                type={ButtonType.Primary}
                size={ButtonSize.Default}
                ariaLabel="Save library"
                disabled={!canSave}
              />
            </Tooltip>
          </div>
        </form>
      </Modal>

      {discardPrompt && (
        <ConfirmationModal
          variant="delete"
          title="Discard these changes?"
          text="Your edits to the library will be lost."
          actionButtonLabel="Discard"
          actionButtonType={ButtonType.Warning}
          onClose={() => setDiscardPrompt(false)}
          onConfirm={() => {
            setDiscardPrompt(false);
            onClose();
          }}
        />
      )}
    </>
  );
}

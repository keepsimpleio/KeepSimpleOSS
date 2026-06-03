import { zodResolver } from '@hookform/resolvers/zod';
import { resolveStrapiUrl } from '@utils/library/resolveStrapiUrl';
import {
  type AddObjectFormData,
  type BookFormData,
  getSchemaForType,
} from '@utils/library/schema/addObjectSchema';
import React, { JSX, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';

import type { IObject } from '@local-types/library/object';
import type { IShelf } from '@local-types/library/shelf';

import { createObject } from '@api/library/object/createObject';
import { reorderObjects } from '@api/library/object/reorderObjects';
import { updateObject } from '@api/library/object/updateObject';
import { getShelvesList } from '@api/library/shelf/getShelvesList';
import { getTagsList } from '@api/library/tag/getTagsList';
import { uploadFile } from '@api/library/upload/uploadFile';

import { ArrowIcon, SearchIcon } from '@icons/library/svg';

import { useAuth } from '@components/Context/library/AuthContext';
import { IconName } from '@components/library/atoms/Icon';
import { Text, TypographyVariant } from '@components/library/atoms/Text';
import {
  Button,
  ButtonSize,
  ButtonType,
} from '@components/library/molecules/Button';
import { ConfirmationModal } from '@components/library/molecules/ConfirmationModal';
import { DatePicker } from '@components/library/molecules/DatePicker';
import { Dropdown } from '@components/library/molecules/Dropdown';
import { ImageDropzone } from '@components/library/molecules/ImageDropzone';
import { Input } from '@components/library/molecules/Input';
import { Modal, useModalClose } from '@components/library/molecules/Modal';
import { ReorderGrid } from '@components/library/molecules/ReorderGrid';
import type { ReorderItem } from '@components/library/molecules/ReorderGrid/ReorderGrid.types';
import { StepIndicator } from '@components/library/molecules/StepIndicator';
import { TagMultiSelect } from '@components/library/molecules/TagMultiSelect';
import type { TagOption } from '@components/library/molecules/TagMultiSelect/TagMultiSelect.types';
import { Textarea } from '@components/library/molecules/Textarea';

import { configByType } from './AddObjectModal.config';
import type { AddObjectModalProps, FieldKey } from './AddObjectModal.types';

import styles from './AddObjectModal.module.scss';

const STEPS = [
  { label: 'General information' },
  { label: '' }, // resolved at render-time from config.step2Label
];

function buildDefaults(
  objectType: AddObjectModalProps['objectType'],
  object?: IObject,
): AddObjectFormData {
  if (!object) {
    return { type: objectType } as AddObjectFormData;
  }
  const a = object.attributes;
  const populated = {
    type: objectType,
    title: a.title ?? '',
    author: a.author ?? '',
    description: a.description ?? '',
    sourceUrl: a.sourceUrl ?? '',
    publicationDate: a.publicationDate ? new Date(a.publicationDate) : null,
    coverImage: null,
  };
  return populated as unknown as AddObjectFormData;
}

const DRAFT_REORDER_ID = 'draft-new';

// Pull the status + Strapi error message out of an axios failure so a rejected
// reorder reports *why* (e.g. 403 permission, 400 "All objects must belong to
// the given shelf") instead of vanishing into a status-less console line.
function describeReorderError(err: unknown): {
  status?: number;
  body?: unknown;
  message: string;
} {
  const response = (err as { response?: { status?: number; data?: unknown } })
    ?.response;
  const body = response?.data;
  const message =
    (body as { error?: { message?: string } })?.error?.message ??
    (err instanceof Error ? err.message : 'Unknown error');
  return { status: response?.status, body, message };
}

function shelfObjectsToReorderItems(
  objects: IObject[] | undefined,
): ReorderItem[] {
  if (!objects?.length) return [];
  return objects.map(o => ({
    id: `object-${o.id}`,
    title: o.attributes.title,
    coverUrl:
      resolveStrapiUrl(o.attributes.coverImage?.data?.attributes.url) ??
      undefined,
  }));
}

export function AddObjectModal(props: AddObjectModalProps): JSX.Element {
  const {
    objectType,
    onClose,
    onCreated,
    onReordered,
    isCreate = true,
    object,
    defaultShelfId,
    shelfObjects,
  } = props;
  const { closeRef, close } = useModalClose(onClose);
  const config = configByType[objectType];
  const editing = !isCreate && !!object;
  const shelfLocked = defaultShelfId != null && !editing;
  const { accountData } = useAuth();

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [tagOptions, setTagOptions] = useState<TagOption[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);
  const [shelves, setShelves] = useState<IShelf[]>([]);
  const [selectedShelfId, setSelectedShelfId] = useState<string | undefined>(
    shelfLocked ? String(defaultShelfId) : undefined,
  );
  const currentReorderId =
    editing && object ? `object-${object.id}` : DRAFT_REORDER_ID;
  const [reorderItems, setReorderItems] = useState<ReorderItem[]>(() => {
    const base = shelfObjectsToReorderItems(shelfObjects);
    // Edit mode: current object is already in `base` — keep its position.
    if (editing && object) return base;
    // Add mode: append a draft placeholder so the user can drag it into place.
    return [...base, { id: DRAFT_REORDER_ID, title: '' }];
  });
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(
    editing
      ? resolveStrapiUrl(object?.attributes.coverImage?.data?.attributes.url)
      : null,
  );

  const schema = useMemo(() => getSchemaForType(objectType), [objectType]);

  const form = useForm<AddObjectFormData>({
    resolver: zodResolver(schema),
    defaultValues: buildDefaults(objectType, editing ? object : undefined),
    mode: 'onChange',
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = form;

  useEffect(() => {
    let cancelled = false;
    getTagsList().then(res => {
      if (cancelled) return;
      const opts: TagOption[] = res.data.map(t => ({
        id: t.id,
        name: t.attributes.name,
        color: t.attributes.color,
      }));
      setTagOptions(opts);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Preset the object's existing tags exactly once, from the object's OWN
  // populated tag data — not by filtering the fetched options. An unpublished
  // tag won't appear in getTagsList, so filtering against it would silently drop
  // the tag; because save backfills the relation from `selectedTags`, that
  // dropped tag would be wiped on the next edit. Seeding from the object keeps
  // every existing tag, and the ref guard stops a late re-render (e.g. a new
  // `object` reference) from clobbering the user's in-progress changes.
  const didPresetTags = useRef(false);
  useEffect(() => {
    if (didPresetTags.current) return;
    if (!editing) return;
    const existing = object?.attributes.tags?.data;
    if (!existing?.length) return;
    didPresetTags.current = true;
    setSelectedTags(
      existing.map(t => ({
        id: t.id,
        name: t.attributes.name,
        color: t.attributes.color,
      })),
    );
  }, [editing, object]);

  useEffect(() => {
    if (!config.hasShelf) return;
    let cancelled = false;
    getShelvesList(objectType).then(res => {
      if (cancelled) return;
      setShelves(res?.data ?? []);
    });
    return () => {
      cancelled = true;
    };
  }, [config.hasShelf, objectType]);

  useEffect(() => {
    if (!editing) return;
    const shelfId = object?.attributes.shelf?.data?.id;
    if (shelfId != null) setSelectedShelfId(String(shelfId));
  }, [editing, object]);

  const handleNext = async () => {
    const isStep1Valid = await form.trigger();
    if (isStep1Valid) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => setCurrentStep(1);

  const onSubmitForm: SubmitHandler<AddObjectFormData> = async data => {
    setSubmitError(null);
    setIsSubmittingForm(true);
    try {
      let coverImageId: number | null | undefined;
      let uploadedCover: {
        id: number;
        url: string;
        name: string;
        mime: string;
        size: number;
      } | null = null;
      if (data.coverImage instanceof File) {
        const uploaded = await uploadFile(data.coverImage);
        coverImageId = uploaded.id;
        uploadedCover = uploaded;
      } else if (editing) {
        const hadCover = !!object?.attributes.coverImage?.data;
        if (hadCover && existingCoverUrl === null) {
          // user explicitly cleared the existing image
          coverImageId = null;
        }
        // otherwise omit (no change)
      }

      const publicationDate =
        objectType === 'book' && (data as BookFormData).publicationDate
          ? (data as BookFormData).publicationDate?.toISOString().slice(0, 10)
          : undefined;

      const tags =
        selectedTags.length > 0 ? selectedTags.map(t => t.id) : undefined;
      // Prefer the user's explicit shelf choice (move-to dropdown / locked add
      // mode), then fall back to the shelf id the parent passed. The fallback
      // matters in edit mode: if the object's `shelf` relation wasn't populated,
      // `selectedShelfId` never resolves and the reorder below would silently
      // skip — `defaultShelfId` keeps a valid `shelfId` in the payload.
      const shelf =
        config.hasShelf && selectedShelfId
          ? Number(selectedShelfId)
          : (defaultShelfId ?? undefined);

      let resultObject: IObject;

      if (editing && object) {
        const payload = {
          title: data.title,
          author: data.author || undefined,
          description: data.description || undefined,
          sourceUrl: 'sourceUrl' in data ? data.sourceUrl : undefined,
          publicationDate,
          tags,
          shelf,
          ...(coverImageId !== undefined ? { coverImage: coverImageId } : {}),
        };
        const res = await updateObject(object.id, payload);
        resultObject = res.data;
      } else {
        // TODO: drop the client-side `slug` once Strapi makes `object.slug`
        // optional (auto-generated from `title`). Backend ticket pending.
        const slug = `${data.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')}-${Date.now()}`;

        const res = await createObject({
          type: objectType,
          title: data.title,
          slug,
          author: data.author || undefined,
          description: data.description || undefined,
          sourceUrl: 'sourceUrl' in data ? data.sourceUrl : undefined,
          publicationDate,
          coverImage: coverImageId ?? undefined,
          tags,
          shelf,
          // object has draftAndPublish: true; publish on create so direct
          // queries see it (populated relations from libraries already include
          // drafts, but a future filtered query would not).
          publishedAt: new Date().toISOString(),
          // TODO: drop once Strapi sets `owner` in `beforeCreate` before
          // required-field validation runs. Backend ticket pending.
          owner: accountData?.id,
        });
        resultObject = res.data;
      }

      // Strapi POST/PUT responses don't reliably populate the wrapped
      // { data: { attributes: { url } } } shape that BookCard reads, so the
      // optimistic shelf render would miss the cover even though the upload
      // succeeded. Backfill from data we already have so the UI is correct
      // until the next library refetch returns the canonical populated shape.
      //
      // On edit, the PUT response also drops relations we didn't touch — so
      // before the upload-backfill below, carry the original object's cover,
      // tags, and shelf forward whenever the user didn't change them.
      // Otherwise an "edit" without touching the cover would visually wipe it.
      if (editing && object) {
        const original = object.attributes;
        const next = {
          ...resultObject,
          attributes: { ...resultObject.attributes },
        };
        // Cover untouched: no new upload AND not explicitly cleared.
        if (
          !uploadedCover &&
          coverImageId !== null &&
          !next.attributes.coverImage?.data
        ) {
          next.attributes.coverImage = original.coverImage;
        }
        // Shelf untouched: payload didn't carry a shelf value.
        if (shelf === undefined && !next.attributes.shelf?.data) {
          next.attributes.shelf = original.shelf;
        }
        resultObject = next;
      }

      const hasCoverRelation =
        !!resultObject.attributes.coverImage?.data?.attributes?.url;
      if (!hasCoverRelation && uploadedCover) {
        resultObject = {
          ...resultObject,
          attributes: {
            ...resultObject.attributes,
            coverImage: {
              data: {
                id: uploadedCover.id,
                attributes: {
                  url: uploadedCover.url,
                  name: uploadedCover.name,
                  mime: uploadedCover.mime,
                  size: uploadedCover.size,
                },
              },
            },
          },
        };
      }
      const hasTagsRelation =
        (resultObject.attributes.tags?.data?.length ?? 0) > 0;
      if (!hasTagsRelation && selectedTags.length > 0) {
        resultObject = {
          ...resultObject,
          attributes: {
            ...resultObject.attributes,
            tags: {
              data: selectedTags.map(t => ({
                id: t.id,
                attributes: { name: t.name, color: t.color },
              })),
            },
          },
        };
      }

      // Land the created/updated object in the parent's list first so the
      // reorder below can apply `order` to a state that already contains it.
      onCreated?.(resultObject);

      // Persist the step-2 drag order. The draft placeholder stands in for the
      // object we just created/updated, so map it to its real id.
      if (shelf != null && reorderItems.length > 1) {
        const orderedObjects = reorderItems
          .map((item, index) => {
            const id =
              item.id === DRAFT_REORDER_ID
                ? resultObject.id
                : Number(item.id.replace('object-', ''));
            return Number.isFinite(id) ? { id, order: index } : null;
          })
          .filter((entry): entry is { id: number; order: number } => !!entry);

        // Optimistically push the new order to the parent so the shelf
        // re-sequences immediately, then persist. Persistence is best-effort:
        // the object itself is already saved, so a reorder failure shouldn't
        // surface as a save failure — the next refetch reconciles.
        onReordered?.(orderedObjects);
        try {
          await reorderObjects({ shelfId: shelf, objects: orderedObjects });
        } catch (reorderError) {
          // The object itself is already saved, so don't lose that work — but
          // don't pretend the reorder landed either. A silent swallow here hid
          // exactly the "drag order doesn't stick after refresh" bug: the
          // optimistic update shows the new order in-session, then a refresh
          // reverts it because this write never landed. Log status + response
          // body (the exact Strapi message — e.g. 403 permission, 400 "objects
          // must belong to the shelf"), roll the parent back to the last-known
          // server order, and tell the user the order didn't apply.
          const { status, body, message } = describeReorderError(reorderError);
          console.error(
            '[AddObjectModal] object reorder failed to persist',
            { shelfId: shelf, objects: orderedObjects, status, body },
            reorderError,
          );
          onReordered?.(
            shelfObjects?.map((o, index) => ({ id: o.id, order: index })) ?? [],
          );
          setSubmitError(
            `Your ${objectType} was saved, but the new order couldn't be applied: ${message}`,
          );
          return;
        }
      }

      setShowSuccess(true);
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : 'Something went wrong. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const renderField = (key: FieldKey) => {
    const label = config.labels[key] ?? key;

    switch (key) {
      case 'title':
        return (
          <div key={key} className={styles.field}>
            <Text
              variant={TypographyVariant.TextSmall}
              className={styles.label}
            >
              {label}
            </Text>
            <Input
              type="text"
              ariaLabel={label}
              placeholder={label}
              placeholderColor="#9E9E9E"
              {...register('title')}
            />
            {errors.title && (
              <p className={styles.error}>{errors.title.message}</p>
            )}
          </div>
        );
      case 'author':
        return (
          <div key={key} className={styles.field}>
            <Text
              variant={TypographyVariant.TextSmall}
              className={styles.label}
            >
              {label}
            </Text>
            <Input
              type="text"
              ariaLabel={label}
              placeholder={label}
              placeholderColor="#9E9E9E"
              {...register('author')}
            />
            {errors.author && (
              <p className={styles.error}>{errors.author.message}</p>
            )}
          </div>
        );
      case 'publicationDate':
        return (
          <div key={key} className={styles.field}>
            <Text
              variant={TypographyVariant.TextSmall}
              className={styles.label}
            >
              {label}
            </Text>
            <Controller
              control={control}
              name="publicationDate"
              render={({ field }) => (
                <DatePicker
                  value={field.value ?? null}
                  onChange={field.onChange}
                  ariaLabel={label}
                  placeholder="Select date"
                />
              )}
            />
            {'publicationDate' in errors && errors.publicationDate?.message && (
              <p className={styles.error}>
                {String(errors.publicationDate.message)}
              </p>
            )}
          </div>
        );
      case 'description':
        return (
          <div key={key} className={styles.field}>
            <Text
              variant={TypographyVariant.TextSmall}
              className={styles.label}
            >
              {label}
            </Text>
            <Textarea
              ariaLabel={label}
              placeholder={`Add a description for this ${objectType}`}
              wrapperClassName={styles.textareaWrapper}
              className={styles.textarea}
              rows={5}
              {...register('description')}
            />
            {errors.description && (
              <p className={styles.error}>{errors.description.message}</p>
            )}
          </div>
        );
      case 'coverImage':
        return (
          <div key={key} className={styles.field}>
            <Text
              variant={TypographyVariant.TextSmall}
              className={styles.label}
            >
              {label}
            </Text>
            <Controller
              control={control}
              name="coverImage"
              render={({ field }) => (
                <ImageDropzone
                  value={field.value ?? null}
                  onChange={field.onChange}
                  existingPreviewUrl={existingCoverUrl ?? undefined}
                  onClearExisting={() => setExistingCoverUrl(null)}
                  ariaLabel={label}
                />
              )}
            />
            {errors.coverImage && (
              <p className={styles.error}>
                {String(errors.coverImage.message)}
              </p>
            )}
          </div>
        );
      case 'sourceUrl':
        return (
          <div key={key} className={styles.field}>
            <Text
              variant={TypographyVariant.TextSmall}
              className={styles.label}
            >
              {label}
            </Text>
            <div className={styles.urlRow}>
              <Input
                type="text"
                ariaLabel={label}
                placeholder="https://…"
                placeholderColor="#9E9E9E"
                wrapperClassName={styles.urlInput}
                {...register('sourceUrl' as never)}
              />
              <Button
                type={ButtonType.Outlined}
                size={ButtonSize.Default}
                label="Search"
                ariaLabel="Fetch metadata from URL"
                Icon={<SearchIcon />}
                onClick={() => {
                  // TODO: hook up URL metadata auto-fetch (YouTube / Spotify / generic OG)
                }}
              />
            </div>
            {'sourceUrl' in errors && errors.sourceUrl?.message && (
              <p className={styles.error}>{String(errors.sourceUrl.message)}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const step1Fields = watch();
  const isStep1Filled = !!step1Fields.title;

  // Live blob URL for the currently-picked cover File so the reorder card
  // mirrors what the user just dropped in step 1. Revoked on change/unmount.
  const liveCoverFile =
    step1Fields.coverImage instanceof File ? step1Fields.coverImage : null;
  const liveCoverObjectUrl = useMemo(
    () => (liveCoverFile ? URL.createObjectURL(liveCoverFile) : null),
    [liveCoverFile],
  );
  useEffect(() => {
    if (!liveCoverObjectUrl) return;
    return () => URL.revokeObjectURL(liveCoverObjectUrl);
  }, [liveCoverObjectUrl]);

  const liveCurrentTitle =
    step1Fields.title || (editing ? object?.attributes.title : '') || '';
  const liveCurrentCoverUrl =
    liveCoverObjectUrl ??
    (editing ? (existingCoverUrl ?? undefined) : undefined);

  const displayedReorderItems = reorderItems.map(item =>
    item.id === currentReorderId
      ? {
          ...item,
          title: liveCurrentTitle || item.title,
          coverUrl: liveCurrentCoverUrl ?? item.coverUrl,
          isCurrent: true,
        }
      : item,
  );

  const shelfOptions = shelves.map(s => ({
    value: String(s.id),
    label: s.attributes.name,
  }));

  const modalTitle = editing ? config.editTitle : config.title;
  const primaryLabel = editing ? config.editSubmitLabel : config.submitLabel;
  const successTitle = editing
    ? `${objectType[0].toUpperCase()}${objectType.slice(1)} updated`
    : `New ${objectType} has been created!`;
  const successText = editing
    ? 'Your changes were saved successfully.'
    : `Your ${objectType} was successfully added to the library.`;

  return (
    <>
      {!showSuccess && (
        <Modal
          className={styles.modal}
          title={modalTitle}
          onClose={onClose}
          closeRef={closeRef}
        >
          <form onSubmit={handleSubmit(onSubmitForm)} noValidate>
            <div className={styles.indicatorWrap}>
              <StepIndicator
                steps={[STEPS[0], { label: config.step2Label }]}
                currentStep={currentStep}
              />
            </div>

            <div className={styles.wrapper}>
              {currentStep === 1 ? (
                <div className={styles.stepBody}>
                  {config.fields.map(renderField)}
                </div>
              ) : (
                <div className={styles.stepBody}>
                  {config.hasShelf && !shelfLocked && (
                    <div className={styles.field}>
                      <Text
                        variant={TypographyVariant.TextSmall}
                        className={styles.label}
                      >
                        Shelf
                      </Text>
                      <Dropdown
                        value={selectedShelfId}
                        onChange={setSelectedShelfId}
                        options={shelfOptions}
                        placeholder={
                          shelfOptions.length === 0
                            ? 'No shelves yet'
                            : 'Select a shelf'
                        }
                        disabled={shelfOptions.length === 0}
                      />
                    </div>
                  )}

                  <div className={styles.field}>
                    <Text
                      variant={TypographyVariant.TextSmall}
                      className={styles.label}
                    >
                      {config.tagsLabel}
                    </Text>
                    <TagMultiSelect
                      options={tagOptions}
                      value={selectedTags}
                      onChange={setSelectedTags}
                      placeholder={config.tagsLabel}
                      emptyState="No tags yet — create one from your library settings."
                      maxItems={10}
                      portal
                    />
                  </div>

                  <div className={styles.field}>
                    <Text
                      variant={TypographyVariant.TextSmall}
                      className={styles.label}
                    >
                      Select tag to reorder objects
                    </Text>
                    <Dropdown
                      options={selectedTags.map(t => ({
                        value: String(t.id),
                        label: t.name,
                      }))}
                      placeholder={
                        selectedTags.length === 0
                          ? 'Pick tags above first'
                          : 'Select a tag to filter'
                      }
                      disabled={selectedTags.length === 0}
                    />
                  </div>

                  <div className={styles.field}>
                    <ReorderGrid
                      items={displayedReorderItems}
                      onReorder={setReorderItems}
                      itemShape={config.itemShape}
                      emptyState="No objects yet on this shelf."
                    />
                  </div>
                </div>
              )}
            </div>

            <div className={styles.footer}>
              {submitError && (
                <p className={styles.footerError}>{submitError}</p>
              )}
              <div className={styles.footerActions}>
                {currentStep === 2 && (
                  <Button
                    type={ButtonType.Text}
                    size={ButtonSize.Default}
                    label="Go back"
                    ariaLabel="Go back to step 1"
                    Icon={<ArrowIcon className={styles.backIcon} />}
                    onClick={e => {
                      e.preventDefault();
                      handleBack();
                    }}
                    className={styles.backButton}
                  />
                )}
                <Button
                  type={ButtonType.Secondary}
                  size={ButtonSize.Wide}
                  label="Cancel"
                  ariaLabel="Cancel"
                  onClick={e => {
                    e.preventDefault();
                    close();
                  }}
                  disabled={isSubmittingForm}
                />
                {currentStep === 1 ? (
                  <Button
                    type={ButtonType.Primary}
                    size={ButtonSize.Wide}
                    label="Next"
                    ariaLabel="Continue to step 2"
                    onClick={e => {
                      e.preventDefault();
                      handleNext();
                    }}
                    disabled={!isStep1Filled || !isValid}
                  />
                ) : (
                  <Button
                    type={ButtonType.Primary}
                    size={ButtonSize.Wide}
                    label={isSubmittingForm ? 'Saving…' : primaryLabel}
                    ariaLabel={primaryLabel}
                    buttonType="submit"
                    disabled={isSubmittingForm}
                  />
                )}
              </div>
            </div>
          </form>
        </Modal>
      )}

      {showSuccess && (
        <ConfirmationModal
          variant="success"
          icon={IconName.Info}
          title={successTitle}
          text={successText}
          actionButtonLabel="Close"
          actionButtonType={ButtonType.Secondary}
          onClose={() => {
            setShowSuccess(false);
            onClose();
          }}
          onConfirm={() => {
            setShowSuccess(false);
            onClose();
          }}
        />
      )}
    </>
  );
}

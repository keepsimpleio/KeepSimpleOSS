import { zodResolver } from '@hookform/resolvers/zod';
import { detectSource } from '@utils/library/detectSource';
import { resolveStrapiUrl } from '@utils/library/resolveStrapiUrl';
import {
  type AddObjectFormData,
  type BookFormData,
  getSchemaForType,
  OBJECT_FIELD_LIMITS,
} from '@utils/library/schema/addObjectSchema';
import classNames from 'classnames';
import React, { JSX, useEffect, useMemo, useRef, useState } from 'react';
import {
  Controller,
  type FieldErrors,
  type SubmitHandler,
  useForm,
} from 'react-hook-form';

import { SHELF_FULL_MESSAGE } from '@constants/library/common';

import type { IAutofillSuggestion } from '@local-types/library/autofill';
import type { IObject } from '@local-types/library/object';
import type { IShelf } from '@local-types/library/shelf';

import { isShelfFullError } from '@lib/library/shelfFull';

import { fetchCoverFile } from '@api/library/autofill/fetchCoverFile';
import { lookupVideoByUrl } from '@api/library/autofill/lookupVideoByUrl';
import { searchAudioSuggestions } from '@api/library/autofill/searchAudioSuggestions';
import { searchBookSuggestions } from '@api/library/autofill/searchBookSuggestions';
import { createObject } from '@api/library/object/createObject';
import { reorderObjects } from '@api/library/object/reorderObjects';
import { updateObject } from '@api/library/object/updateObject';
import { getShelvesList } from '@api/library/shelf/getShelvesList';
import { getTagsList } from '@api/library/tag/getTagsList';
import { uploadFile } from '@api/library/upload/uploadFile';

import { ArrowIcon, SearchIcon } from '@icons/library/svg';

import { useAuth } from '@components/Context/library/AuthContext';
import { CharCount } from '@components/library/atoms/CharCount';
import { IconName } from '@components/library/atoms/Icon';
import { InkLine } from '@components/library/atoms/InkLine';
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
import { TitleAutocomplete } from '@components/library/molecules/TitleAutocomplete';

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
    source: a.source ?? '',
    duration: a.duration ?? undefined,
    publicationDate: a.publicationDate ? new Date(a.publicationDate) : null,
    coverImage: null,
  };
  return populated as unknown as AddObjectFormData;
}

const DRAFT_REORDER_ID = 'draft-new';

// Provider dates come as "2019", "2019-10", "2019-10-15" or a full ISO stamp
// ("2019-10-15T00:00:00Z"). Only the calendar date matters; a two-digit or
// missing year is not a date.
function parsePublicationDate(raw: string): Date | null {
  const datePart = raw.trim().split('T')[0];
  const [y, m, d] = datePart.split('-').map(Number);
  if (!y || Number.isNaN(y) || y < 1000) return null;
  const date = new Date(y, (m || 1) - 1, d || 1);
  return Number.isNaN(date.getTime()) ? null : date;
}

// A calendar date, as the user picked it, with no timezone in the way:
// toISOString() shifted a local midnight back a day for everyone east of UTC.
function formatCalendarDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

type AutofillField = 'title' | 'author' | 'description';

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
    tagIds: (o.attributes.tags?.data ?? []).map(t => t.id),
  }));
}

export function AddObjectModal(props: AddObjectModalProps): JSX.Element {
  const {
    objectType,
    onClose,
    onCancel,
    onCreated,
    onReordered,
    isCreate = true,
    object,
    defaultShelfId,
    shelfObjects,
  } = props;
  const config = configByType[objectType];
  const editing = !isCreate && !!object;
  const shelfLocked = defaultShelfId != null && !editing;
  const { accountData } = useAuth();

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  // Synchronous twin of `isSubmittingForm` — a ref flips before the re-render
  // that disables the button, so it catches a second click fired in the gap.
  const submitInFlightRef = useRef(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // A create that saved but whose step-2 order did not: said on the success
  // card, since the form itself is done and must not be submitted twice.
  const [successNote, setSuccessNote] = useState<string | null>(null);
  const [discardPrompt, setDiscardPrompt] = useState(false);
  const [reorderDirty, setReorderDirty] = useState(false);
  const [autofillNotice, setAutofillNotice] = useState<string | null>(null);
  // Fields whose current text was written by autofill, not typed. A later
  // suggestion may overwrite those; anything the user typed stays.
  const autofilledRef = useRef<Set<AutofillField>>(new Set());
  const [isFetchingVideoMeta, setIsFetchingVideoMeta] = useState(false);
  const [isFetchingCover, setIsFetchingCover] = useState(false);
  const [coverNotice, setCoverNotice] = useState<string | null>(null);

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
  // Which tag the sequence is being read through. `null` = the whole shelf.
  // A lens only; the saved order is always the shelf's single sequence.
  const [sequenceTagId, setSequenceTagId] = useState<number | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(
    editing
      ? resolveStrapiUrl(object?.attributes.coverImage?.data?.attributes.url)
      : null,
  );

  // Untick the tag the sequence is filtered by and the lens has nothing to
  // stand on — fall back to the whole shelf.
  useEffect(() => {
    if (sequenceTagId == null) return;
    if (!selectedTags.some(tag => tag.id === sequenceTagId)) {
      setSequenceTagId(null);
    }
  }, [selectedTags, sequenceTagId]);

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
    setValue,
    formState: { errors, isValid, isDirty },
  } = form;

  // Closing loses a form in progress. Ask first when there is something to
  // lose; a pristine form (or one already saved) closes at once. "Something"
  // is a typed field, a changed tag set, a changed shelf or a drag in step 2,
  // compared against what the form opened with.
  const initialTagIds = useMemo(
    () =>
      (editing ? (object?.attributes.tags?.data ?? []) : [])
        .map(t => t.id)
        .sort()
        .join(','),
    [editing, object],
  );
  const tagsDirty =
    selectedTags
      .map(t => t.id)
      .sort()
      .join(',') !== initialTagIds;
  const shelfDirty =
    editing &&
    selectedShelfId != null &&
    defaultShelfId != null &&
    Number(selectedShelfId) !== defaultShelfId;
  const hasUnsavedWork =
    !showSuccess && (isDirty || tagsDirty || shelfDirty || reorderDirty);
  // Backing out of an edit returns to the overview; backing out of a create
  // closes the whole thing. A finished save always closes.
  const leave = onCancel ?? onClose;
  const requestClose = () => {
    if (isSubmittingForm) return;
    if (hasUnsavedWork) {
      setDiscardPrompt(true);
      return;
    }
    leave();
  };
  const { closeRef, close } = useModalClose(requestClose);

  const markTyped = (field: AutofillField) => {
    autofilledRef.current.delete(field);
  };

  // Live lengths for the character counters. `author`/`description` are optional
  // on every schema, so coalesce to '' before measuring.
  const titleLength = (watch('title') ?? '').length;
  const authorLength = (watch('author') ?? '').length;
  const descriptionLength = (watch('description') ?? '').length;

  // Push a provider suggestion into the form. Values are clamped to the zod
  // limits so an autofill can never leave the form invalid; the cover is
  // best-effort — fields land first, the image follows when the proxy resolves.
  const applySuggestion = async (
    s: IAutofillSuggestion,
    options?: { titleChosen?: boolean },
  ) => {
    const isBook = objectType === 'book';
    const setOptions = { shouldValidate: true, shouldDirty: true } as const;
    const titleLimit = OBJECT_FIELD_LIMITS.title[objectType];

    // Only empty fields and fields autofill itself wrote last time are
    // overwritten. Text the user typed is theirs: a pasted YouTube link used
    // to wipe a finished description.
    const canWrite = (field: AutofillField) => {
      const current = (form.getValues(field) as string | undefined)?.trim();
      return !current || autofilledRef.current.has(field);
    };
    const write = (field: AutofillField, next: string) => {
      setValue(field, next, setOptions);
      autofilledRef.current.add(field);
    };

    // A title picked from the typeahead is the user's own choice for that
    // field, so it always lands.
    if (options?.titleChosen || canWrite('title')) {
      write('title', s.title.slice(0, titleLimit));
    }
    if (s.author && canWrite('author')) {
      write('author', s.author.slice(0, OBJECT_FIELD_LIMITS.author));
    }
    if (s.description && canWrite('description')) {
      write(
        'description',
        s.description.slice(0, OBJECT_FIELD_LIMITS.description),
      );
    }
    if (!isBook) {
      // A suggestion's link is the provider's own — for audio it's always an
      // Apple/iTunes trackViewUrl. Only seed the URL when the user hasn't
      // entered their own, so a pasted Spotify (etc.) link isn't clobbered.
      // Either way derive Source from whatever URL ends up in the form, never
      // from the suggestion link directly — otherwise Source could read
      // "Apple Music" while the URL field shows a Spotify link.
      const currentUrl = (
        form.getValues('sourceUrl' as never) as unknown as string
      )?.trim();
      if (!currentUrl && s.sourceUrl) {
        setValue('sourceUrl' as never, s.sourceUrl as never, setOptions);
      }
      const effectiveUrl = currentUrl || s.sourceUrl;
      if (effectiveUrl) {
        const detected = detectSource(effectiveUrl);
        if (detected) {
          setValue('source' as never, detected as never, setOptions);
        }
      }
    }
    if (objectType === 'audio' && s.durationSeconds != null) {
      setValue('duration' as never, s.durationSeconds as never, setOptions);
    }
    if (isBook && s.publicationDate) {
      const date = parsePublicationDate(s.publicationDate);
      if (date) {
        setValue('publicationDate' as never, date as never, setOptions);
      }
    }
    if (s.coverUrl) {
      // The cover is the slow half of an autofill: a full-resolution scan
      // travelling through our proxy. Snapshot what sits in the slot now, and
      // only write ours if nothing else landed there meanwhile — an image the
      // user dropped while waiting outranks the provider's.
      const before = form.getValues('coverImage');
      setIsFetchingCover(true);
      setCoverNotice(null);
      try {
        const file = await fetchCoverFile(s.coverUrl, s.title);
        if (!file) {
          setCoverNotice(
            "Couldn't fetch this book's cover. Add one from your files.",
          );
        } else if (form.getValues('coverImage') === before) {
          setValue('coverImage', file, setOptions);
        }
      } finally {
        setIsFetchingCover(false);
      }
    }
  };

  const handleVideoUrlFetch = async (rawUrl?: string) => {
    const url = (
      rawUrl ?? (form.getValues('sourceUrl' as never) as unknown as string)
    )?.trim();
    setAutofillNotice(null);
    if (!url) return;
    setIsFetchingVideoMeta(true);
    try {
      const result = await lookupVideoByUrl(url);
      if (result.status === 'unsupported') {
        setAutofillNotice(
          'Autofill supports YouTube links — fill the details manually.',
        );
        return;
      }
      if (result.status === 'error') {
        setAutofillNotice(
          "Couldn't fetch video details. Please fill them manually.",
        );
        return;
      }
      await applySuggestion(result.suggestion);
    } finally {
      setIsFetchingVideoMeta(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    getTagsList(accountData?.id).then(res => {
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
  }, [accountData?.id]);

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

  // Validation lives on step-1 fields, which aren't on screen during step 2 —
  // so a rejected submit used to look like the button doing nothing at all.
  // Name the offending field and walk the user back to it.
  const onInvalidForm = (formErrors: FieldErrors<AddObjectFormData>) => {
    const firstKey = Object.keys(formErrors)[0] as
      | keyof AddObjectFormData
      | undefined;
    const firstMessage = firstKey
      ? (formErrors[firstKey]?.message as string | undefined)
      : undefined;
    setSubmitError(
      firstMessage ??
        `Some details are missing. Check step 1 before saving this ${objectType}.`,
    );
    setCurrentStep(1);
  };

  const onSubmitForm: SubmitHandler<AddObjectFormData> = async data => {
    // A click that lands while the previous save is still in flight must not
    // start a second create — `isSubmittingForm` only disables the button after
    // React re-renders, which is a frame too late for a fast double-click.
    if (submitInFlightRef.current) return;
    submitInFlightRef.current = true;
    setSubmitError(null);

    // Object titles must be unique within a shelf — warn before saving instead
    // of letting the backend reject it. Only on create; an edit keeps its title.
    if (!editing) {
      const newTitle = data.title.trim().toLowerCase();
      const isDuplicate = (shelfObjects ?? []).some(
        o => o.attributes.title.trim().toLowerCase() === newTitle,
      );
      if (isDuplicate) {
        setSubmitError(
          `A ${objectType} with this title already exists on this shelf.`,
        );
        // Release the guard: this exit is before the try/finally that would
        // otherwise clear it, and a stuck flag would deaden the button.
        submitInFlightRef.current = false;
        return;
      }
    }

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
        let uploaded: Awaited<ReturnType<typeof uploadFile>>;
        try {
          uploaded = await uploadFile(data.coverImage);
        } catch (uploadErr) {
          // The image goes straight to Strapi. When it exceeds the server's
          // upload limit the request is rejected with 413 — or dropped by the
          // proxy so axios sees a bare network error (no response). Either way,
          // surface a clear size message instead of the generic save error.
          const status = (uploadErr as { response?: { status?: number } })
            ?.response?.status;
          const hasResponse = !!(uploadErr as { response?: unknown })?.response;
          setSubmitError(
            status === 413 || !hasResponse
              ? 'Image is too large. Maximum size is 5 MB.'
              : "Couldn't upload the image. Please try again.",
          );
          return;
        }
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

      const pickedDate =
        objectType === 'book'
          ? (data as BookFormData).publicationDate
          : undefined;
      const publicationDate = pickedDate
        ? formatCalendarDate(pickedDate)
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
      // Edit mode with the shelf changed: the object leaves this shelf. The
      // step-2 grid still shows the old shelf, so its order is not this
      // object's business any more and the reorder below is skipped.
      const movingShelf =
        editing &&
        shelf != null &&
        defaultShelfId != null &&
        shelf !== defaultShelfId;

      let resultObject: IObject;

      if (editing && object) {
        const payload = {
          title: data.title,
          author: data.author || undefined,
          description: data.description || undefined,
          sourceUrl: 'sourceUrl' in data ? data.sourceUrl : undefined,
          source: 'source' in data ? data.source || undefined : undefined,
          duration: 'duration' in data ? data.duration : undefined,
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
          source: 'source' in data ? data.source || undefined : undefined,
          duration: 'duration' in data ? data.duration : undefined,
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
        // Shelf changed: PUT does not populate the relation, and the shelf
        // reads the destination off it to move the card. Fill it in from the
        // option the user picked.
        if (movingShelf && !next.attributes.shelf?.data) {
          const target = shelves.find(s => s.id === shelf);
          if (target) {
            next.attributes.shelf = {
              data: {
                id: target.id,
                attributes: {
                  name: target.attributes.name,
                  type: objectType,
                  order: target.attributes.order,
                },
              },
            };
            next.attributes.shelfName = target.attributes.name;
          }
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
      if (shelf != null && !movingShelf && reorderItems.length > 1) {
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
          // The object is saved; only the order did not land. Say so on the
          // success card: keeping the form up invited a second save, which
          // in create mode is a duplicate.
          setSuccessNote(
            `The new order couldn't be applied (${message}). You can reorder from the ${objectType}'s edit screen.`,
          );
        }
      }

      setShowSuccess(true);
    } catch (e) {
      // Backend caps each shelf at 21 objects (all types combined) and rejects
      // an over-limit create — or a move into a full shelf via the shelf
      // dropdown — with a 400. Surface the dedicated full-shelf copy.
      if (isShelfFullError(e)) {
        setSubmitError(SHELF_FULL_MESSAGE);
        return;
      }
      // Axios failures carry a raw "Request failed with status code 500" — not
      // useful to a user. Show a friendly line (the title is the usual culprit)
      // and only fall back to a specific message when it isn't an HTTP error.
      const status = (e as { response?: { status?: number } })?.response
        ?.status;
      const isHttpError = !!(e as { response?: unknown })?.response;
      const message =
        status === 401 || status === 403
          ? 'Your session has expired. Reload the page and sign in again.'
          : status === 400
            ? `Could not save this ${objectType}. Please try a different title.`
            : isHttpError || !(e instanceof Error)
              ? `Could not save this ${objectType}. Please try again.`
              : e.message;
      setSubmitError(message);
    } finally {
      submitInFlightRef.current = false;
      setIsSubmittingForm(false);
    }
  };

  const submitForm = handleSubmit(onSubmitForm, onInvalidForm);

  const renderField = (key: FieldKey) => {
    const label = config.labels[key] ?? key;

    switch (key) {
      case 'title': {
        // Typeahead autofill is create-only (silently rewriting an object the
        // user opened to edit would be hostile) and not for video — videos
        // autofill from a pasted YouTube URL instead.
        const hasTypeahead = isCreate && objectType !== 'video';
        return (
          <div key={key} className={styles.field}>
            <Text
              variant={TypographyVariant.TextSmall}
              className={styles.label}
            >
              {label}
            </Text>
            {hasTypeahead ? (
              <TitleAutocomplete
                registration={register('title', {
                  onChange: () => markTyped('title'),
                })}
                ariaLabel={label}
                placeholder={label}
                placeholderColor="#9E9E9E"
                fetchSuggestions={
                  objectType === 'book'
                    ? searchBookSuggestions
                    : searchAudioSuggestions
                }
                onSelect={suggestion =>
                  applySuggestion(suggestion, { titleChosen: true })
                }
              />
            ) : (
              <Input
                type="text"
                ariaLabel={label}
                placeholder={label}
                placeholderColor="#9E9E9E"
                {...register('title', { onChange: () => markTyped('title') })}
              />
            )}
            <CharCount
              current={titleLength}
              max={OBJECT_FIELD_LIMITS.title[objectType]}
            />
            {errors.title && (
              <p className={styles.error}>{errors.title.message}</p>
            )}
          </div>
        );
      }
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
              {...register('author', { onChange: () => markTyped('author') })}
            />
            <CharCount
              current={authorLength}
              max={OBJECT_FIELD_LIMITS.author}
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
              {...register('description', {
                onChange: () => markTyped('description'),
              })}
            />
            <CharCount
              current={descriptionLength}
              max={OBJECT_FIELD_LIMITS.description}
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
                  onChange={file => {
                    setCoverNotice(null);
                    field.onChange(file);
                  }}
                  existingPreviewUrl={existingCoverUrl ?? undefined}
                  onClearExisting={() => setExistingCoverUrl(null)}
                  loading={isFetchingCover}
                  ariaLabel={label}
                />
              )}
            />
            {errors.coverImage ? (
              <p className={styles.error}>
                {String(errors.coverImage.message)}
              </p>
            ) : (
              coverNotice && <p className={styles.hint}>{coverNotice}</p>
            )}
          </div>
        );
      case 'sourceUrl': {
        const sourceUrlReg = register('sourceUrl' as never);
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
                {...sourceUrlReg}
                onBlur={e => {
                  sourceUrlReg.onBlur(e);
                  // Derive the platform name (Spotify, YouTube…) from the link
                  // so `source` fills itself — never typed by the user.
                  const detected = detectSource(e.target.value);
                  if (detected) {
                    setValue('source' as never, detected as never, {
                      shouldDirty: true,
                    });
                  }
                }}
                onPaste={
                  objectType === 'video'
                    ? e => {
                        const pasted = e.clipboardData.getData('text');
                        // Fire only for YouTube-looking links; the route does
                        // the real video-id validation.
                        if (/youtu\.?be/i.test(pasted)) {
                          handleVideoUrlFetch(pasted);
                        }
                      }
                    : undefined
                }
              />
              {objectType === 'video' && (
                <Button
                  type={ButtonType.Secondary}
                  size={ButtonSize.Default}
                  label={isFetchingVideoMeta ? 'Fetching…' : 'Autofill'}
                  ariaLabel="Fetch video details from URL"
                  Icon={<SearchIcon />}
                  disabled={isFetchingVideoMeta}
                  onClick={() => handleVideoUrlFetch()}
                />
              )}
            </div>
            {'sourceUrl' in errors && errors.sourceUrl?.message ? (
              <p className={styles.error}>{String(errors.sourceUrl.message)}</p>
            ) : (
              autofillNotice && <p className={styles.hint}>{autofillNotice}</p>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };

  const step1Fields = watch();
  const isStep1Filled = !!step1Fields.title;
  // Why Next is off, in words, before any field has been touched: an untouched
  // form shows no validation text, so the dead button was unexplained.
  const nextBlockedReason = !isStep1Filled
    ? objectType === 'book'
      ? 'Enter a title to continue.'
      : !(step1Fields as { sourceUrl?: string }).sourceUrl
        ? 'Enter the URL and a title to continue.'
        : 'Enter a title to continue.'
    : !isValid
      ? 'Fix the highlighted fields to continue.'
      : null;

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
          // The object being edited carries whatever tags are ticked right now,
          // not what it was saved with, so it shows up under a tag the moment
          // that tag is added above.
          tagIds: selectedTags.map(t => t.id),
        }
      : item,
  );

  // The sequence is shown through one tag at a time. Filtering only narrows
  // what is on screen: positions are still the shelf's, and a drag inside the
  // narrowed view writes back into the slots those objects hold in it.
  const visibleReorderItems =
    sequenceTagId == null
      ? displayedReorderItems
      : displayedReorderItems.filter(item =>
          item.tagIds?.includes(sequenceTagId),
        );

  const handleReorder = (next: ReorderItem[]) => {
    setReorderDirty(true);
    const orderedIds = next.map(item => item.id);
    const movedIds = new Set(orderedIds);
    setReorderItems(prev => {
      const slots: number[] = [];
      prev.forEach((item, index) => {
        if (movedIds.has(item.id)) slots.push(index);
      });
      const byId = new Map(prev.map(item => [item.id, item]));
      const result = [...prev];
      orderedIds.forEach((id, index) => {
        const item = byId.get(id);
        if (item) result[slots[index]] = item;
      });
      return result;
    });
  };

  const shelfOptions = shelves.map(s => ({
    value: String(s.id),
    label: s.attributes.name,
  }));

  const modalTitle = editing ? config.editTitle : config.title;
  // The step promises exactly what it holds: books add a shelf picker.
  const step2Label =
    config.hasShelf && !shelfLocked
      ? 'Shelf, position and tags'
      : 'Position and tags';
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
          onClose={requestClose}
          closeRef={closeRef}
        >
          <form
            onSubmit={e => {
              e.preventDefault();
              void submitForm(e);
            }}
            noValidate
          >
            <div className={styles.indicatorWrap}>
              <StepIndicator
                steps={[STEPS[0], { label: step2Label }]}
                currentStep={currentStep}
              />
            </div>
            <InkLine seed={5} className={styles.bandRule} />

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
                      emptyState="No tags yet. Create one from the Tags panel on the right"
                      maxItems={10}
                      portal
                    />
                  </div>

                  <div className={styles.field}>
                    <Text
                      variant={TypographyVariant.TextSmall}
                      className={styles.label}
                    >
                      Modify object sequence
                    </Text>
                    {selectedTags.length > 0 && (
                      <div
                        className={styles.sequenceFilters}
                        role="group"
                        aria-label="Show the sequence through one tag"
                      >
                        <button
                          type="button"
                          onClick={() => setSequenceTagId(null)}
                          aria-pressed={sequenceTagId === null}
                          className={classNames(styles.sequenceFilter, {
                            [styles.sequenceFilterActive]:
                              sequenceTagId === null,
                          })}
                        >
                          Whole shelf
                        </button>
                        {selectedTags.map(tag => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() =>
                              setSequenceTagId(
                                sequenceTagId === tag.id ? null : tag.id,
                              )
                            }
                            aria-pressed={sequenceTagId === tag.id}
                            className={classNames(styles.sequenceFilter, {
                              [styles.sequenceFilterActive]:
                                sequenceTagId === tag.id,
                            })}
                          >
                            {tag.name}
                          </button>
                        ))}
                      </div>
                    )}
                    <ReorderGrid
                      items={visibleReorderItems}
                      onReorder={handleReorder}
                      itemShape={config.itemShape}
                      emptyState={
                        sequenceTagId == null
                          ? 'No content yet on this shelf.'
                          : 'Nothing else on this shelf carries that tag yet.'
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <InkLine seed={6} className={styles.bandRule} />
            <div className={styles.footer}>
              {/* One held line above the buttons: the save error, or on step 1
                  the reason Next is off. Never a layout jump when it lands. */}
              <p
                className={classNames(styles.footerError, {
                  [styles.footerHint]: !submitError,
                })}
                aria-live="polite"
              >
                {submitError ??
                  (currentStep === 1
                    ? (nextBlockedReason ?? '\u00a0')
                    : '\u00a0')}
              </p>
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
                    if (hasUnsavedWork) {
                      setDiscardPrompt(true);
                      return;
                    }
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
                    // Submits through the same handler the form's onSubmit
                    // uses, but from the click itself: a native submit event
                    // can be swallowed by whatever else is listening on the
                    // way up, and the user reads that as a dead button.
                    onClick={e => {
                      e.preventDefault();
                      void submitForm();
                    }}
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
          text={successNote ? `${successText} ${successNote}` : successText}
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

      {discardPrompt && (
        <ConfirmationModal
          variant="delete"
          title="Discard these changes?"
          text={
            editing
              ? 'Your edits to this item will be lost.'
              : `This ${objectType} has not been saved yet.`
          }
          actionButtonLabel="Discard"
          actionButtonType={ButtonType.Warning}
          onClose={() => setDiscardPrompt(false)}
          onConfirm={() => {
            setDiscardPrompt(false);
            leave();
          }}
        />
      )}
    </>
  );
}

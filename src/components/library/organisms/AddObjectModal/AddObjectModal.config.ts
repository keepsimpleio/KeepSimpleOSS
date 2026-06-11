import type { ObjectType } from '@local-types/library/object';

import type { FieldKey, ObjectTypeConfig } from './AddObjectModal.types';

export type ObjectFieldLabels = Partial<Record<FieldKey, string>>;

export interface ResolvedConfig extends ObjectTypeConfig {
  labels: Required<Pick<ObjectFieldLabels, FieldKey>> & ObjectFieldLabels;
}

export const configByType: Record<ObjectType, ResolvedConfig> = {
  book: {
    title: 'Add new book',
    editTitle: 'Edit book',
    step2Label: 'Book position and tags',
    submitLabel: 'Save book details',
    editSubmitLabel: 'Save changes',
    tagsLabel: 'Book tags',
    hasShelf: true,
    itemShape: 'square',
    fields: ['title', 'author', 'publicationDate', 'description', 'coverImage'],
    labels: {
      title: 'Book title',
      author: 'Author',
      publicationDate: 'Publication date',
      description: 'Description',
      coverImage: 'Book cover',
      sourceUrl: 'URL',
    },
  },
  video: {
    title: 'Add new video',
    editTitle: 'Edit video',
    step2Label: 'Video position and tags',
    submitLabel: 'Save video details',
    editSubmitLabel: 'Save changes',
    tagsLabel: 'Video tags',
    hasShelf: false,
    itemShape: 'landscape',
    fields: ['sourceUrl', 'title', 'author', 'coverImage', 'description'],
    labels: {
      title: 'Video title',
      author: 'Creator / channel',
      publicationDate: 'Publication date',
      description: 'Description',
      coverImage: 'Thumbnail',
      sourceUrl: 'URL',
    },
  },
  audio: {
    title: 'Add new audio',
    editTitle: 'Edit audio',
    step2Label: 'Audio position and tags',
    submitLabel: 'Save audio details',
    editSubmitLabel: 'Save changes',
    tagsLabel: 'Audio tags',
    hasShelf: false,
    itemShape: 'square',
    fields: ['sourceUrl', 'title', 'author', 'description', 'coverImage'],
    labels: {
      title: 'Audio title',
      author: 'Creator / artist',
      publicationDate: 'Publication date',
      description: 'Description',
      coverImage: 'Cover',
      sourceUrl: 'URL',
    },
  },
};

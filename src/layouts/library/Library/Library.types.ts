export interface LibraryTemplateProps {
  libraryId: string;
  /**
   * Leave the owner's share-selection bar out. The share-link recipient page
   * renders its own read-only bar in the same fixed slot, and an owner opening
   * their own link would otherwise get one buried under the other.
   */
  hideSharePanel?: boolean;
}

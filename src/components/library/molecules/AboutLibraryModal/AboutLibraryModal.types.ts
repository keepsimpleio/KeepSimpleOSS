export interface AboutLibraryModalProps {
  onClose: () => void;
  /** The account already owns a library, so the action opens it instead. */
  ownsLibrary?: boolean;
  /**
   * The modal's one action: sign in, go create a library, or open the one
   * owned. The home page owns the routing; the modal closes first.
   */
  onLibraryAction: () => void;
}

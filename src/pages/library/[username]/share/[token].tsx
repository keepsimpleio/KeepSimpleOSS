import type { GetServerSideProps, NextPage } from 'next';
import React, { JSX, useEffect, useMemo, useState } from 'react';

import { DEFAULT_SEO } from '@constants/library/seo.config';

import type { IObject } from '@local-types/library/object';
import type {
  IShareLinkView,
  ShareLinkStatus,
} from '@local-types/library/shareLink';

import { readSidebarCollapsedForRequest } from '@lib/library/sidebarPanel';

import { getShareLink } from '@api/library/getShareLink';

import { ShareIcon } from '@icons/library/svg';

import { AuthProvider } from '@components/Context/library/AuthContext';
import { DashboardProvider } from '@components/Context/library/DashboardContext';
import {
  GlobalStateProvider,
  useGlobalState,
} from '@components/Context/library/GlobalStateContext';
import { ShareSelectionProvider } from '@components/Context/library/ShareSelectionContext';
import { Text, TypographyVariant } from '@components/library/atoms/Text';
import {
  Button,
  ButtonSize,
  ButtonType,
} from '@components/library/molecules/Button';
import { Modal, useModalClose } from '@components/library/molecules/Modal';
import { SharedWithYouModal } from '@components/library/molecules/SharedWithYouModal';
import { ObjectOverviewModal } from '@components/library/organisms/ObjectOverviewModal';
import { ShareSelectionPanel } from '@components/library/organisms/ShareSelectionPanel';
import { Sidebar } from '@components/library/organisms/Sidebar';
import SeoGenerator from '@components/SeoGenerator';

import { LibraryTemplate } from '@layouts/library/Library';

import pageStyles from '../../library.module.scss';
import styles from './share.module.scss';

type SharePageProps = {
  username: string;
  token: string;
  /** Desktop info panel folded to its spine — read from the viewer's cookie. */
  initialSidebarCollapsed?: boolean;
};

// Copy for the non-ok outcomes. `error` is the retryable transport/parse case;
// the rest map to the backend's 410/404/400 responses. `empty` and
// `mismatch` are decided here, after the library underneath has loaded.
type RecipientStatus = Exclude<ShareLinkStatus, 'ok'> | 'empty' | 'mismatch';

const ERROR_COPY: Record<RecipientStatus, { title: string; text: string }> = {
  empty: {
    title: 'Nothing left to show',
    text: 'The items behind this link have since been removed or made private. The library itself is still open below.',
  },
  mismatch: {
    title: 'This link belongs to another library',
    text: 'The address names one library but the shared items come from a different one. Ask the sender for the link as they copied it.',
  },
  expired: {
    title: 'This link has expired',
    text: 'Share links are valid for 7 days. Ask the owner to send you a fresh one.',
  },
  notFound: {
    title: 'This link is no longer available',
    text: 'The selection behind this link can’t be found. It may have been revoked.',
  },
  invalid: {
    title: 'This link looks broken',
    text: 'The link couldn’t be read. Double-check that you copied the whole URL.',
  },
  error: {
    title: 'Something went wrong',
    text: 'We couldn’t load this selection. Check your connection and try again.',
  },
};

function ShareLinkErrorModal({
  status,
  onClose,
}: {
  status: RecipientStatus;
  onClose: () => void;
}): JSX.Element {
  const { closeRef, close } = useModalClose(onClose);
  const { title, text } = ERROR_COPY[status];

  return (
    <Modal className={styles.errorModal} onClose={onClose} closeRef={closeRef}>
      <div className={styles.errorBody}>
        <Text
          className={styles.errorTitle}
          variant={TypographyVariant.TextBaseBold}
        >
          {title}
        </Text>
        <Text
          className={styles.errorText}
          variant={TypographyVariant.TextSmall}
        >
          {text}
        </Text>
        <Button
          label="View the library"
          ariaLabel="Dismiss and view the library"
          onClick={close}
          type={ButtonType.Primary}
          size={ButtonSize.Wide}
          className={styles.errorAction}
        />
      </div>
    </Modal>
  );
}

function ShareRecipientView({ username, token }: SharePageProps): JSX.Element {
  const { currentShelves, currentOwner, currentLibrary } = useGlobalState();
  const [view, setView] = useState<IShareLinkView | null>(null);
  const [introOpen, setIntroOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [activeObject, setActiveObject] = useState<IObject | null>(null);

  useEffect(() => {
    let active = true;
    void getShareLink(token).then(result => {
      if (!active) return;
      setView(result);
      if (result.status !== 'ok') setErrorOpen(true);
    });
    return () => {
      active = false;
    };
  }, [token]);

  // The address names a library; the token names objects. They must agree.
  // Shared objects always sit on public shelves, so every one of them should
  // appear in the library rendered underneath: none of them there means the
  // token was pasted under someone else's name. (No verdict until the library
  // has loaded and published its shelves.)
  const visibleIds = useMemo(() => {
    const ids = new Set<number>();
    for (const shelf of currentShelves) {
      for (const o of shelf.attributes.objects?.data ?? []) ids.add(o.id);
    }
    return ids;
  }, [currentShelves]);
  const libraryLoaded = currentLibrary !== null;

  const status: RecipientStatus | 'ok' | null = useMemo(() => {
    if (!view) return null;
    if (view.status !== 'ok') return view.status;
    if (view.objects.length === 0) return 'empty';
    if (libraryLoaded && !view.objects.some(o => visibleIds.has(o.id))) {
      return 'mismatch';
    }
    return 'ok';
  }, [view, libraryLoaded, visibleIds]);

  // Items the library no longer shows (deleted, moved to a private shelf)
  // drop out of the recipient's sequence rather than opening blank.
  const sharedObjects = useMemo(() => {
    if (!view || view.status !== 'ok') return [];
    return libraryLoaded
      ? view.objects.filter(o => visibleIds.has(o.id))
      : view.objects;
  }, [view, libraryLoaded, visibleIds]);

  useEffect(() => {
    if (status === 'ok') {
      setIntroOpen(true);
    } else if (status === 'empty' || status === 'mismatch') {
      setErrorOpen(true);
    }
  }, [status]);

  // The owner's name comes from the loaded library, never the URL segment.
  const ownerName = currentOwner?.username || username;

  return (
    <>
      {introOpen && status === 'ok' && (
        <SharedWithYouModal
          ownerName={ownerName}
          itemCount={sharedObjects.length}
          onClose={() => setIntroOpen(false)}
          onViewSelection={() => {
            setIntroOpen(false);
            setPanelOpen(true);
          }}
        />
      )}

      {/* The way back in. Dismissing the intro (or the error) used to strand
          the recipient with no control anywhere on the page to reopen the
          shared selection or re-read why it could not show. */}
      {status && status !== 'ok' && !errorOpen && (
        <button
          type="button"
          className={styles.reopen}
          onClick={() => setErrorOpen(true)}
        >
          <ShareIcon />
          <Text variant={TypographyVariant.TextSmall}>
            Why the shared selection isn&apos;t showing
          </Text>
        </button>
      )}
      {status === 'ok' && !panelOpen && !introOpen && (
        <button
          type="button"
          className={styles.reopen}
          onClick={() => setPanelOpen(true)}
        >
          <ShareIcon />
          <Text variant={TypographyVariant.TextSmall}>
            Open the shared selection ({sharedObjects.length})
          </Text>
        </button>
      )}

      {panelOpen && status === 'ok' && (
        <ShareSelectionPanel
          objects={sharedObjects}
          ownerUsername={username}
          readOnly
          initiallyExpanded
          onObjectClick={setActiveObject}
        />
      )}

      {activeObject && (
        <ObjectOverviewModal
          object={activeObject}
          isOwner={false}
          ownerUsername={ownerName}
          onClose={() => setActiveObject(null)}
        />
      )}

      {errorOpen && status && status !== 'ok' && (
        <ShareLinkErrorModal
          status={status}
          onClose={() => setErrorOpen(false)}
        />
      )}
    </>
  );
}

const SharePage: NextPage<SharePageProps> = ({
  username,
  token,
  initialSidebarCollapsed,
}) => {
  const pageTitle = `${username} | ${DEFAULT_SEO.siteName}`;

  return (
    <AuthProvider>
      <GlobalStateProvider initialSidebarCollapsed={initialSidebarCollapsed}>
        <DashboardProvider>
          <ShareSelectionProvider>
            <SeoGenerator
              strapiSEO={{
                title: pageTitle,
                description: DEFAULT_SEO.description,
                keywords: '',
                pageTitle,
              }}
              ogTags={{
                ogTitle: pageTitle,
                ogDescription: DEFAULT_SEO.description,
                ogType: DEFAULT_SEO.type,
                ogImage: {
                  data: {
                    attributes: { url: '', staticUrl: DEFAULT_SEO.image },
                  },
                },
              }}
            />
            <div className={`library ${pageStyles.dashboard}`}>
              <main className={pageStyles.content}>
                <LibraryTemplate libraryId={username} hideSharePanel />
              </main>
              <Sidebar />
            </div>
            <ShareRecipientView username={username} token={token} />
          </ShareSelectionProvider>
        </DashboardProvider>
      </GlobalStateProvider>
    </AuthProvider>
  );
};

export default SharePage;

export const getServerSideProps: GetServerSideProps<
  SharePageProps
> = async context => {
  const username = String(context.params?.username ?? '');
  const token = String(context.params?.token ?? '');

  if (!token) {
    return { notFound: true };
  }

  const initialSidebarCollapsed = readSidebarCollapsedForRequest(
    context.req.headers.cookie,
  );

  return {
    props: { username, token, initialSidebarCollapsed },
  };
};

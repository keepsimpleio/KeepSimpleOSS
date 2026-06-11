import type { GetServerSideProps, NextPage } from 'next';
import React, { JSX, useEffect, useState } from 'react';

import { isLibraryEnabled } from '@constants/library/common';
import { DEFAULT_SEO } from '@constants/library/seo.config';

import type {
  IShareLinkView,
  ShareLinkStatus,
} from '@local-types/library/shareLink';

import { getShareLink } from '@api/library/getShareLink';

import { AuthProvider } from '@components/Context/library/AuthContext';
import { DashboardProvider } from '@components/Context/library/DashboardContext';
import { GlobalStateProvider } from '@components/Context/library/GlobalStateContext';
import { ShareSelectionProvider } from '@components/Context/library/ShareSelectionContext';
import { Text, TypographyVariant } from '@components/library/atoms/Text';
import {
  Button,
  ButtonSize,
  ButtonType,
} from '@components/library/molecules/Button';
import { Modal, useModalClose } from '@components/library/molecules/Modal';
import { SharedWithYouModal } from '@components/library/molecules/SharedWithYouModal';
import { ShareSelectionPanel } from '@components/library/organisms/ShareSelectionPanel';
import { Sidebar } from '@components/library/organisms/Sidebar';
import SeoGenerator from '@components/SeoGenerator';

import { LibraryTemplate } from '@layouts/library/Library';

import pageStyles from '../../library.module.scss';
import styles from './share.module.scss';

type SharePageProps = {
  username: string;
  token: string;
};

// Copy for the non-ok outcomes. `error` is the retryable transport/parse case;
// the rest map to the backend's 410/404/400 responses.
const ERROR_COPY: Record<
  Exclude<ShareLinkStatus, 'ok'>,
  { title: string; text: string }
> = {
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
  status: Exclude<ShareLinkStatus, 'ok'>;
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
  const [view, setView] = useState<IShareLinkView | null>(null);
  const [introOpen, setIntroOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [errorDismissed, setErrorDismissed] = useState(false);

  useEffect(() => {
    let active = true;
    void getShareLink(token).then(result => {
      if (!active) return;
      setView(result);
      // Only the happy path leads with the intro modal; errors get their own.
      if (result.status === 'ok' && result.objects.length > 0) {
        setIntroOpen(true);
      }
    });
    return () => {
      active = false;
    };
  }, [token]);

  const showError =
    !!view && view.status !== 'ok' && !errorDismissed
      ? (view.status as Exclude<ShareLinkStatus, 'ok'>)
      : null;

  return (
    <>
      {introOpen && view?.status === 'ok' && (
        <SharedWithYouModal
          ownerName={username}
          itemCount={view.objects.length}
          onClose={() => setIntroOpen(false)}
          onViewSelection={() => {
            setIntroOpen(false);
            setPanelOpen(true);
          }}
        />
      )}

      {panelOpen && view?.status === 'ok' && view.objects.length > 0 && (
        <ShareSelectionPanel
          objects={view.objects}
          ownerUsername={username}
          readOnly
        />
      )}

      {showError && (
        <ShareLinkErrorModal
          status={showError}
          onClose={() => setErrorDismissed(true)}
        />
      )}
    </>
  );
}

const SharePage: NextPage<SharePageProps> = ({ username, token }) => {
  const pageTitle = `${username} | ${DEFAULT_SEO.siteName}`;

  return (
    <AuthProvider>
      <GlobalStateProvider>
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
                <LibraryTemplate libraryId={username} />
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
  if (!isLibraryEnabled()) {
    return { notFound: true };
  }

  const username = String(context.params?.username ?? '');
  const token = String(context.params?.token ?? '');

  if (!token) {
    return { notFound: true };
  }

  return {
    props: { username, token },
  };
};

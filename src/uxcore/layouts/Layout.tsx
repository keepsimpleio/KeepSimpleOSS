import { getPersonaList } from '@uxcore/api/personas';
import SavedPersonas from '@uxcore/components/_uxcp/SavedPersonas';
import { GlobalContext } from '@uxcore/components/Context/GlobalContext';
import ToolHeader from '@uxcore/components/ToolHeader';
import UXCorePopup from '@uxcore/components/UXCorePopup';
import decisionTable from '@uxcore/data/decisionTable';
import useUCoreMobile from '@uxcore/hooks/uxcoreMobile';
import { TRouter } from '@uxcore/local-types/global';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { locale } = router as TRouter;

  const [personas, setPersonas] = useState([]);
  const {
    uxcatUserInfo,
    setUxcatUserInfo,
    setSelectedTitle,
    setUpdatedUsername,
  } = useContext(GlobalContext);
  const [openPersonas, setOpenPersonas] = useState<boolean>(false);
  const [headerPodcastOpen, setHeaderPodcastOpen] = useState(false);

  const { savedPersonasTitles } = decisionTable[locale];
  const { isUxcoreMobile } = useUCoreMobile()[1];

  // Pages Router: usePathname() from next/navigation is App-Router-only and
  // returns undefined on SSR but the real path on the client → hydration
  // mismatch on every UX Core page. router.pathname is the Pages-Router
  // equivalent and is stable across SSR/client.
  const pathName = router.pathname ?? '';
  const normalizedPath = pathName.replace(/\/+$/, '');

  const pathnameWithBypass = /^\/uxcp$/i.test(normalizedPath)
    ? '/uxcp/'
    : normalizedPath;
  const path = pathnameWithBypass.replace(/\/+$/, '');

  const isUXCoreRoot = path === '/uxcore';
  const isUXCoreNested = path.startsWith('/uxcore/');
  const isUXCGNested = path.startsWith('/uxcg/');
  const isUXCatNested = path.startsWith('/uxcat/');
  const isUserProfileRoot = path.startsWith('/user/');
  const shouldHideToolHeader = isUXCoreRoot && isUxcoreMobile;

  const fetchData = async () => {
    const result = await getPersonaList();
    setPersonas(result);
  };

  useEffect(() => {
    fetchData().then(r => console.log(r));
  }, []);

  return (
    <>
      <ToolHeader
        blockLanguageSwitcher={isUXCoreNested || isUXCGNested}
        openPersonaModal={setOpenPersonas}
        showSavedPersonas={true}
        setUpdatedUsername={setUpdatedUsername}
        userInfo={uxcatUserInfo}
        disablePageSwitcher={isUXCatNested || isUserProfileRoot}
        setUserInfo={setUxcatUserInfo}
        setOpenPodcast={setHeaderPodcastOpen}
        setSelectedTitle={setSelectedTitle}
        hidden={shouldHideToolHeader}
      />
      <main>{children}</main>
      {openPersonas && (
        <SavedPersonas
          personaTableTitles={savedPersonasTitles}
          savedPersonas={personas}
          setOpenPersonas={setOpenPersonas}
          setSavedPersonas={setPersonas}
          changedUsername={uxcatUserInfo?.user?.username}
        />
      )}
      {headerPodcastOpen && (
        <UXCorePopup
          setOpenPodcast={setHeaderPodcastOpen}
          openPodcast={headerPodcastOpen}
        />
      )}
    </>
  );
}

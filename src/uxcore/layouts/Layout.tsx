import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';

import { TRouter } from '@uxcore/local-types/global';

import useUCoreMobile from '@uxcore/hooks/uxcoreMobile';

import { getPersonaList } from '@uxcore/api/personas';

import decisionTable from '@uxcore/data/decisionTable';

import SavedPersonas from '@uxcore/components/_uxcp/SavedPersonas';
import { GlobalContext } from '@uxcore/components/Context/GlobalContext';
import ToolHeader from '@uxcore/components/ToolHeader';
import UXCorePopup from '@uxcore/components/UXCorePopup';

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

  const pathName = usePathname() ?? '';
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
        openPodcast={headerPodcastOpen}
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

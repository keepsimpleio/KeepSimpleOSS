import { useEffect } from 'react';

import useGlobals from '@hooks/useGlobals';

import SeoGenerator from '@components/SeoGenerator';
import MapClient from '@components/vibesuite/MapClient';

export default function VibeSuitePage() {
  const [{ initUseGlobals, unmountUseGlobals }, { isDarkTheme }] = useGlobals();

  useEffect(() => {
    initUseGlobals(null);

    return () => {
      unmountUseGlobals();
    };
  }, []);

  return (
    <>
      <SeoGenerator
        strapiSEO={{
          title: 'Vibe Suite — AI Skill Guide | KeepSimple',
          description:
            'Interactive skill map that guides you from first AI prompt to shipped product. Track progress across 50+ hands-on projects covering LLMs, frontend, backend, and more.',
          keywords: 'AI skills, vibe coding, learn AI, skill map, LLM projects',
          pageTitle: 'Vibe Suite — AI Skill Guide',
        }}
        ogTags={{
          ogTitle: 'Vibe Suite — AI Skill Guide | KeepSimple',
          ogDescription:
            'Interactive skill map that guides you from first AI prompt to shipped product. Track progress across 50+ hands-on projects.',
          ogType: 'website',
        }}
      />
      <MapClient initialProgress={{}} isDarkTheme={isDarkTheme} />
    </>
  );
}

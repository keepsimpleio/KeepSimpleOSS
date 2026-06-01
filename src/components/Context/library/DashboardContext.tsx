'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { ITag } from '@/types/tag';

interface DashboardContextValue {
  tags: ITag[];
  setTags: (tags: ITag[]) => void;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
  initialTags?: ITag[];
}

export function DashboardProvider({ children, initialTags = [] }: DashboardProviderProps) {
  const [tags, setTags] = useState<ITag[]>(initialTags);

  const value = useMemo(
    () => ({
      tags,
      setTags,
    }),
    [tags]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard(): DashboardContextValue {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }

  return context;
}

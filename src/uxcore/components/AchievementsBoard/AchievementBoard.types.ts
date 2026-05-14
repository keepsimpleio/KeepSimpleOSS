import {
  ClassAttributes,
  HTMLAttributes,
  JSX,
  JSXElementConstructor,
  LegacyRef,
  ReactElement,
  ReactNode,
  ReactPortal,
} from 'react';

import { AchievementsTypes } from '@uxcore/local-types/uxcat-types/types';

export type AchievementsBoardProps = {
  achievements: any;
  handleOnDragEnd: any;
  generalAchievements: AchievementsTypes[];
  specialAchievements: AchievementsTypes[];
  receivedAchievementPercentage: {
    uxCore: number;
    keepSimple: number;
  };
  isLoading: boolean;
  hiddenAchievement?: string;
  keepsimpleAchievements: any;
};

export type providedChildProps = {
  innerRef: LegacyRef<HTMLDivElement>;
  draggableProps: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLDivElement> &
    HTMLAttributes<HTMLDivElement>;
  dragHandleProps: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLDivElement> &
    HTMLAttributes<HTMLDivElement>;
};

export type providedProps = {
  droppableProps: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLUListElement> &
    HTMLAttributes<HTMLUListElement>;
  innerRef: LegacyRef<HTMLUListElement>;
  placeholder:
    | string
    | number
    | boolean
    | ReactElement<any, string | JSXElementConstructor<any>>
    | Iterable<ReactNode>
    | ReactPortal;
};

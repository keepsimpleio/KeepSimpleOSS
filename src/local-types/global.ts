import { Dispatch } from 'react';
export type TLocales = 'en' | 'ru' | 'hy';
export type TRouter = {
  locale: TLocales;
  locales: readonly TLocales[];
  asPath: string;
};

export type ActionType = (...args: any[]) => void;

export interface ActionsType {
  [key: string]: ActionType;
}

export type CustomHookType = [ActionsType, any];
export type DispatchFuntion = Dispatch<any>;

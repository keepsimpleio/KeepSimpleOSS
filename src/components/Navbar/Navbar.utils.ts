import type { TNavbarDataItem } from '@local-types/data';

export const isActivePage = (data: TNavbarDataItem, path: string): boolean => {
  const { href, submenuItems } = data;
  let res = false;

  if (submenuItems) {
    res = !!submenuItems.filter(subMenu => subMenu.href === path).length;
  } else {
    res = href === path;
  }

  return res;
};

import { IUser } from '@local-types/library/user';

export interface UserDropDownProps {
  accountData: IUser | null;
  handleDropdownChange: (option: string) => void;
  openLoginModalToogler: () => void;
}

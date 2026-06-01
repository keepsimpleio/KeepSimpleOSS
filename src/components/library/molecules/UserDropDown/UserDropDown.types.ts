import { IUser } from '@/types/user';

export interface UserDropDownProps {
  accountData: IUser | null;
  handleDropdownChange: (option: string) => void;
  openLoginModalToogler: () => void;
}

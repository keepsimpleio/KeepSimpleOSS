import React, { JSX } from 'react';
import Image from 'next/image';

import { Text } from '@/components/atoms/Text';
import { Dropdown } from '@/components/molecules/Dropdown';

import { IUser } from '@/types/user';
import type { UserDropDownProps } from './UserDropDown.types';

import { AvatarIcon } from '@/assets/svg';
import styles from './UserDropDown.module.scss';

export function UserDropDown(props: UserDropDownProps): JSX.Element {
  const { accountData, handleDropdownChange, openLoginModalToogler } = props;

  return accountData ? (
    <div className={styles.tools}>
      <Dropdown
        onChange={handleDropdownChange}
        options={[{ label: 'Log Out', value: 'logout' }]}
        ariaLabel="User menu"
        className={styles.dropdown}
        menuClassName={styles.menu}
        triggerClassName={styles.trigger}
        customHeader={
          <div className={styles.headerr}>
            <Image
              src={
                (accountData as IUser)?.picture ||
                (accountData as IUser)?.image ||
                '/default-avatar.png'
              }
              width={32}
              height={32}
              alt="Avatar"
            />
            <Text className={styles.text}>
              {(accountData as IUser)?.username || (accountData as IUser)?.name || 'User'}
            </Text>
          </div>
        }
      />
    </div>
  ) : (
    <div role="button" className={styles.user} onClick={openLoginModalToogler}>
      <AvatarIcon />
      <Text>Log In</Text>
    </div>
  );
}

import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';

import { TRouter } from '@uxcore/local-types/global';

import { useClickOutside } from '@uxcore/hooks/useClickOutside';

import uxcatData from '@data/uxcat';

import styles from './Dropdown.module.scss';

interface DropdownProps {
  selected: string;
  values: string[];
  sendingValues?: string[];
  isWide?: boolean;
  setIsAllSelected?: (isAllSelected: boolean) => void;
  className?: string;
  onChange?: (value: string) => void;
}

const Dropdown: FC<DropdownProps> = ({
  selected,
  values,
  isWide,
  setIsAllSelected,
  className,
  onChange,
  sendingValues,
}) => {
  const ref = useClickOutside(toggleDropdown);
  const router = useRouter();
  const { locale } = router as TRouter;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  const { allTxt } = uxcatData[locale];

  function toggleDropdown() {
    setIsOpen(false);
  }

  const handleSelect = (value: string) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    setSelectedValue(selected);
  }, [locale]);

  useEffect(() => {
    if (setIsAllSelected) {
      if (selectedValue !== allTxt) {
        setIsAllSelected(false);
      } else {
        setIsAllSelected(true);
      }
    }
  }, [selectedValue]);

  return (
    <div
      className={cn(styles.dropdown, {
        [styles.wide]: isWide,
      })}
      onClick={e => {
        e.stopPropagation();
        setIsOpen(prev => !prev);
      }}
      ref={ref}
    >
      <div
        onClick={e => {
          e.stopPropagation();
          setIsOpen(prev => !prev);
        }}
        className={styles.header}
      >
        <span> {selectedValue} </span>
        <img
          src={`/assets/icons/arrow-down.svg`}
          alt={'arrow-down'}
          className={cn(styles.arrow, className, {
            [styles.isOpen]: isOpen,
          })}
        />
      </div>
      {isOpen && (
        <div className={styles.body}>
          {values.map((value, index) => (
            <div
              key={index}
              className={cn(styles.item, {
                [styles.selectedValue]: value === selectedValue,
              })}
              onClick={e => {
                e.stopPropagation();
                setIsOpen(prev => !prev);
                handleSelect(value);
                if (onChange) {
                  onChange(sendingValues[index] || value);
                }
              }}
            >
              {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

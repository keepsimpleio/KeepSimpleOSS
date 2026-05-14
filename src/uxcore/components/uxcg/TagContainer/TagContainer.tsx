import cn from 'classnames';
import Image from 'next/image';
import { FC } from 'react';

import { Development } from '@icons/uxcgIcons/Development';
import { Marketing } from '@icons/uxcgIcons/Marketing';
import { Monitoring } from '@icons/uxcgIcons/Monitoring';
import { Released } from '@icons/uxcgIcons/Released';
import { TeamAssemblyIcon } from '@icons/uxcgIcons/TeamAssembly';

import { TagContainerProps } from './TagContainer.types';

import styles from './TagContainer.module.scss';

const TagContainer: FC<TagContainerProps> = ({
  title,
  id,
  isSelected,
  activeFilter,
  onClick,
  backgroundUrl,
  iconName,
  resultTags,
  locale,
  setStageName,
}) => {
  const idStr = String(id);

  const isFromResults = resultTags?.length > 0 && resultTags.includes(idStr);
  const isActive = isSelected || isFromResults;

  const backgroundImage = isActive ? backgroundUrl : '/assets/uxcg/grey-bg.png';
  const iconsDepedingOnNames = {
    team: <TeamAssemblyIcon />,
    development: <Development />,
    marketing: <Marketing />,
    released: <Released />,
    monitoring: <Monitoring />,
  };
  const icon = iconName
    ? iconsDepedingOnNames[iconName as keyof typeof iconsDepedingOnNames]
    : null;

  return (
    <div
      data-id={id}
      className={cn(styles.tagContainer, {
        [styles[iconName]]: iconName,
        [styles.selected]: isActive,
        [styles[`${iconName}Selected`]]: isSelected && iconName,
      })}
      onClick={e => {
        onClick?.(String(id));
        setStageName?.(title);
      }}
    >
      <Image
        src={backgroundImage}
        width={170}
        height={250}
        alt={title[locale || 'en']}
        unoptimized
        className={styles.backgroundImage}
      />
      <div className={styles.iconAndTitle} id={String(id)}>
        <span className={styles.title}>{title[locale]}</span>
        <div className={styles.iconWrapper}>{icon}</div>
      </div>
      <Image
        src={'/assets/uxcg/icons/selected.svg'}
        alt={'Selected State'}
        width={18}
        height={18}
        unoptimized
        className={cn(styles.selectedIcon, {
          [styles.visible]: isSelected && activeFilter !== 'all',
        })}
      />
    </div>
  );
};
export default TagContainer;

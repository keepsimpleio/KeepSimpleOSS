import { FC, Fragment, useCallback, useState } from 'react';

import MobileBiasModal from './MobileBiasModal';

interface MobileProps {
  locale: 'en' | 'ru' | 'hy';
  description: string;
  number: number;
  linkClassName: string;
  text: string;
  slug?: string;
}

const Mobile: FC<MobileProps> = ({
  locale,
  description,
  number,
  linkClassName,
  text,
  slug,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleClick = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const title = `#${number} ${text}`;

  return (
    <Fragment>
      <span className={linkClassName} onClick={handleClick}>
        {title}
      </span>
      {isModalVisible && (
        <MobileBiasModal
          locale={locale}
          title={title}
          description={description}
          number={number}
          onClose={handleCloseModal}
          slug={slug}
        />
      )}
    </Fragment>
  );
};

export default Mobile;

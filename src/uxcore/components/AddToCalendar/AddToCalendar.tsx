import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';

import type { TRouter } from '@uxcore/local-types/global';

import { useClickOutside } from '@uxcore/hooks/useClickOutside';
import useMobile from '@uxcore/hooks/useMobile';

import calendar from '@data/uxcat/calendar';

import CalendarItems from '@uxcore/components/CalendarItems';
import Modal from '@uxcore/components/Modal';

import styles from './AddToCalendar.module.scss';

type AddToCalendarProps = {
  openOnHover?: boolean;
  startTime: string | Date | number;
  toggleCalendar?: () => void;
};
const AddToCalendar: FC<AddToCalendarProps> = ({
  openOnHover,
  startTime,
  toggleCalendar,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const ref = useClickOutside(toggleCalendar);
  const { isMobile } = useMobile()[1];
  const [isShown, setIsShown] = useState(false);

  const currentLocale = locale === 'ru' ? 'ru' : 'en';

  const { addToCalendar, title, description } = calendar[currentLocale];
  const calendarDescription = `${description} ${process.env.NEXT_PUBLIC_DOMAIN}/uxcat/start-test`;

  const event = {
    title: title,
    startTime: startTime?.toString(),
    description: calendarDescription,
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/uxcat/start-test`,
  };

  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.startTime}&details=${encodeURIComponent(calendarDescription)}`;

  const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(calendarDescription)}&startdt=${event.startTime}`;

  return (
    <>
      {!isMobile ? (
        <>
          <div
            ref={ref}
            className={cn({
              [styles.openOnHover]: openOnHover,
              [styles.calendar]: !openOnHover,
            })}
            onMouseEnter={() => openOnHover && setIsShown(true)}
            onMouseLeave={() => openOnHover && setIsShown(false)}
          >
            <div className={styles.header}>
              <span className={styles.addToCalendarTxt}>{addToCalendar}</span>
            </div>
            <div className={styles.body}>
              <CalendarItems
                event={event}
                googleCalendarUrl={googleCalendarUrl}
                outlookCalendarUrl={outlookCalendarUrl}
              />
            </div>
          </div>
          <div
            className={cn(styles.overlay, {
              [styles.show]: isShown,
            })}
          ></div>
        </>
      ) : (
        <Modal
          title={addToCalendar}
          size={'small'}
          grayTitle
          hasBorder
          onClick={toggleCalendar}
        >
          <CalendarItems
            event={event}
            googleCalendarUrl={googleCalendarUrl}
            outlookCalendarUrl={outlookCalendarUrl}
          />
        </Modal>
      )}
    </>
  );
};

export default AddToCalendar;

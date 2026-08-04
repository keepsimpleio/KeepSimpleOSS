import { buildICS, CalendarEvent, downloadICS } from '@uxcore/lib/ics';
import Image from 'next/image';
import { FC } from 'react';

import styles from './CalendarItems.module.scss';

type CalendarItemsProps = {
  event: CalendarEvent;
  googleCalendarUrl: string;
  outlookCalendarUrl: string;
};
const CalendarItems: FC<CalendarItemsProps> = ({
  event,
  outlookCalendarUrl,
  googleCalendarUrl,
}) => {
  return (
    <div className={styles.body}>
      <div className={styles.iconAndLink}>
        <button
          type="button"
          className={styles.apple}
          onClick={() => downloadICS(buildICS(event), 'uxcat-reminder.ics')}
        >
          <Image
            src={'/assets/calendar/apple.png'}
            alt={'apple calendar'}
            className={styles.icon}
            width={24}
            height={24}
          />
          Apple
        </button>
      </div>
      <div className={styles.iconAndLink}>
        <a
          href={googleCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.google}
        >
          <Image
            src={'/assets/calendar/google.png'}
            alt={'google calendar'}
            className={styles.icon}
            width={24}
            height={24}
          />
          Google
        </a>
      </div>
      <div className={styles.iconAndLink}>
        <a
          href={outlookCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.outlook}
        >
          <Image
            src={'/assets/calendar/outlook.png'}
            alt={'outlook calendar'}
            className={styles.icon}
            width={24}
            height={24}
          />
          Outlook
        </a>
      </div>
    </div>
  );
};

export default CalendarItems;

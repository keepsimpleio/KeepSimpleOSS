import { useRouter } from 'next/router';

import rawContent from './ConsensusBias.content';

import styles from './ConsensusBias.module.scss';

const useContent = () => {
  const { locale = 'en' } = useRouter();
  return rawContent[locale as keyof typeof rawContent] ?? rawContent.en;
};

const Bar = ({
  percent,
  color,
  label,
  value,
}: {
  percent: number;
  color: string;
  label: string;
  value: string;
}) => (
  <div className={styles.barRow}>
    <div className={styles.barLabel}>{label}</div>
    <div className={styles.barTrack}>
      <div
        className={styles.barFill}
        style={{ width: `${percent}%`, background: color }}
      />
    </div>
    <div className={styles.barValue}>{value}</div>
  </div>
);

export function Before() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.pollHead}>{c.title}</div>
      <div className={styles.pollSubhead}>{c.before.subhead}</div>
      <div className={styles.poll}>
        {c.before.options.map(o => (
          <Bar
            key={o.label}
            percent={o.percent}
            color={o.percent > 50 ? '#28587b' : '#9e9e9e'}
            label={o.label}
            value={`${o.percent}%`}
          />
        ))}
      </div>
      <div className={styles.decision}>
        <span className={styles.checkIcon}>&#10003;</span>
        <span>
          <strong>{c.before.decisionLabel}</strong> {c.before.decision}
        </span>
      </div>
    </div>
  );
}

export function After() {
  const c = useContent();
  return (
    <div className={styles.container}>
      <div className={styles.pollHead}>{c.title}</div>
      <div className={styles.dual}>
        <div className={styles.column}>
          <div className={styles.colLabel}>{c.after.teamLabel}</div>
          {c.after.team.map(o => (
            <Bar
              key={o.label}
              percent={o.percent}
              color="#28587b"
              label={o.label}
              value={`${o.percent}%`}
            />
          ))}
        </div>
        <div className={styles.column}>
          <div className={styles.colLabel}>{c.after.customerLabel}</div>
          {c.after.customers.map(o => (
            <Bar
              key={o.label}
              percent={o.percent}
              color="#cd7232"
              label={o.label}
              value={`${o.percent}%`}
            />
          ))}
        </div>
      </div>
      <div className={styles.gap}>
        <span className={styles.gapIcon}>&#9889;</span>
        <span>
          <strong>{c.after.gapLabel}</strong> {c.after.gap}
        </span>
      </div>
    </div>
  );
}

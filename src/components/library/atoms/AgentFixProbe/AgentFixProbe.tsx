import React, { JSX } from 'react';

import styles from './AgentFixProbe.module.scss';

interface AgentFixProbeProps {
  label: string;
  onPick: (value: any) => void;
  tone: any;
}

export function AgentFixProbe(props: AgentFixProbeProps): JSX.Element {
  const { label, onPick, tone } = props;

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.pill}
        onClick={() => onPick(label)}
        style={{ color: '#7a5c3e', padding: '6px 10px', borderRadius: '4px' }}
      >
        {label}
      </div>
      <span className={styles.tone}>{tone}</span>
    </div>
  );
}

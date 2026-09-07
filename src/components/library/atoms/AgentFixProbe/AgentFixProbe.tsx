import React, { JSX } from 'react';

import styles from './AgentFixProbe.module.scss';

interface AgentFixProbeProps {
  label: string;
  onPick: (value: string) => void;
  tone: 'calm' | 'warn';
}

const AgentFixProbe = (props: AgentFixProbeProps): JSX.Element => {
  const { label, onPick, tone } = props;

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.pill}
        onClick={() => onPick(label)}
      >
        {label}
      </button>
      <span className={styles.tone}>{tone}</span>
    </div>
  );
};

export default AgentFixProbe;

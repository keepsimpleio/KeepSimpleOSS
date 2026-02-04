export type ProgressBarProps = {
  stops: number[];
  stopIndex?: number;
  setStopIndex?: (index: number) => void;
  isStrengthSection?: boolean;
  // TODO: change any
  activityLevels?: any;
};

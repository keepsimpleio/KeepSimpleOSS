import { FC } from 'react';

import styles from './Checkbox.module.scss';

type CheckboxProps = {
  visibleTxt: string;
  everyone: string;
  onlyYou: string;
  setRadioValue: (radioValue: string) => void;
  radioValue: string;
};

const Checkbox: FC<CheckboxProps> = ({
  visibleTxt,
  everyone,
  onlyYou,
  setRadioValue,
  radioValue,
}) => {
  const handleRadioChange = event => {
    setRadioValue(event.target.value);
  };

  return (
    <>
      <span className={styles.visibleTxtMobile}> {visibleTxt} </span>
      <div className={styles.checkboxes}>
        <span className={styles.visibleTxt}> {visibleTxt} </span>
        <div className={styles.wrapper}>
          <label className={styles.container}>
            <input
              type="radio"
              value="everyone"
              checked={radioValue === 'everyone'}
              onChange={handleRadioChange}
              className={styles.checkbox}
            />
            <span className={styles.checkmark}></span>
          </label>
          <span className={styles.txt}> {everyone}</span>
        </div>
        <div className={styles.wrapper}>
          <label className={styles.container}>
            <input
              type="radio"
              value="onlyMe"
              checked={radioValue === 'onlyMe'}
              onChange={handleRadioChange}
              className={styles.checkbox}
            />
            <span className={styles.checkmark}></span>
          </label>

          <span className={styles.txt}>{onlyYou}</span>
        </div>
      </div>
    </>
  );
};
export default Checkbox;

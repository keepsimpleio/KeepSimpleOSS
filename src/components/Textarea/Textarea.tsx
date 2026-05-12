import cn from 'classnames';
import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import styles from './Textarea.module.scss';

type TTextarea = {
  label?: string;
  placeholder?: string;
  showError?: boolean;
  validationFunction?: (value: string) => boolean;
  errorMessage?: string;
  onChange?: (value: string) => void;
  isValidCallback?: (isValid: boolean) => void;
  className?: string;
  text?: string;
};

const Textarea: FC<TTextarea> = ({
  label,
  placeholder,
  showError,
  onChange,
  errorMessage,
  isValidCallback,
  validationFunction,
  className,
  text,
}) => {
  const [value, setValue] = useState('');
  const debounceRef: any = useRef();
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const { value: newValue } = e.target;

      setValue(newValue);
      if (onChange) onChange(newValue);

      if (validationFunction) {
        clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
          const newIsValid = !!newValue ? validationFunction(newValue) : true;
          if (isValidCallback) isValidCallback(newIsValid);
        }, 250);
      }
    },
    [isValidCallback, validationFunction, onChange],
  );

  useEffect(() => {
    if (text) setValue(text);
  }, [text]);

  return (
    <div
      className={cn(styles.Textarea, {
        [styles.Error]: showError,
      })}
    >
      <div className={styles.Label}>{label}</div>
      <div className={styles.TextareaWrapper}>
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={className}
        ></textarea>
        {validationFunction && (
          <div className={styles.ErrorMessage}>{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default Textarea;

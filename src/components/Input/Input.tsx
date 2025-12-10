import {
  ChangeEvent,
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import styles from './Input.module.scss';

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 8.5C15 12.0899 12.0899 15 8.5 15C4.91015 15 2 12.0899 2 8.5C2 4.91015 4.91015 2 8.5 2C12.0899 2 15 4.91015 15 8.5ZM13.7618 15.176C12.3145 16.3183 10.4869 17 8.5 17C3.80558 17 0 13.1944 0 8.5C0 3.80558 3.80558 0 8.5 0C13.1944 0 17 3.80558 17 8.5C17 10.4869 16.3183 12.3145 15.176 13.7618L19.2071 17.7929C19.5976 18.1834 19.5976 18.8166 19.2071 19.2071C18.8166 19.5976 18.1834 19.5976 17.7929 19.2071L13.7618 15.176Z"
      fill="#CBCBCB"
    />
  </svg>
);

type TInput = {
  label?: string;
  labelHint?: string;
  placeholder?: string;
  showMessage?: boolean;
  validationFunction?: (value: string) => boolean;
  errorMessage?: string | ReactElement;
  messageType?: 'error' | 'tip';
  onChange?: (value: string) => void;
  isValidCallback?: (isValid: boolean) => void;
  value?: string;
  marginBottom?: number;
  searchIcon?: boolean;
  clearIcon?: boolean;
  onIconClick?: () => void;
  charLimit?: number;
  disabled?: boolean;
  controlled?: boolean;
};

const Input: FC<TInput> = ({
  label,
  labelHint,
  placeholder,
  showMessage,
  onChange,
  errorMessage,
  messageType = 'error',
  isValidCallback,
  validationFunction,
  marginBottom,
  searchIcon,
  clearIcon,
  onIconClick,
  charLimit,
  value: incomingValue = '',
  disabled,
  controlled,
}) => {
  const [value, setValue] = useState(incomingValue);
  const [isCharLimitVisible, setIsCharLimitVisible] = useState(false);
  const debounceRef: any = useRef();
  const charLimitDebounceRef: any = useRef();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value: newValue } = e.target;

      if (charLimit) {
        if (!!newValue) {
          setIsCharLimitVisible(true);
          clearTimeout(charLimitDebounceRef.current);
        }

        charLimitDebounceRef.current = setTimeout(() => {
          setIsCharLimitVisible(false);
        }, 1000);

        if (newValue.length > charLimit) return;
      }

      if (validationFunction) {
        clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
          const newIsValid = !!newValue
            ? showMessage || validationFunction(newValue)
            : true;
          if (isValidCallback) isValidCallback(newIsValid);
        }, 250);
      }

      if (!controlled) setValue(newValue);
      if (onChange) onChange(newValue);
    },
    [
      isValidCallback,
      validationFunction,
      onChange,
      setValue,
      charLimit,
      controlled,
      showMessage,
    ],
  );

  useEffect(() => {
    setValue(incomingValue);
  }, [incomingValue]);

  const inlineStyles = useMemo(() => {
    const newStyles: any = {};

    if (marginBottom || marginBottom === 0)
      newStyles.marginBottom = marginBottom;

    return newStyles;
  }, [marginBottom]);

  const inputRestProps = useMemo(() => {
    if (!controlled) return {};

    return {
      value: incomingValue !== undefined ? incomingValue : value,
    };
  }, [controlled, value]);
  return (
    <div
      className={cn(styles.Input, {
        [styles.Error]: showMessage && messageType === 'error',
        [styles.ShowMessage]: showMessage,
      })}
      style={inlineStyles}
    >
      {label && (
        <div className={styles.Label}>
          <span> {label}</span>
          {labelHint && (
            <>
              <img
                data-tooltip-id={'tooltip-label'}
                src="/keepsimple_/assets/icons/q-mark.svg"
                width="auto"
                height="auto"
                alt="question-mark"
                className={styles.LabelHintIcon}
              />
              <ReactTooltip
                id={'tooltip-label'}
                place={'top'}
                className={styles.tooltip}
              >
                <span> {labelHint}</span>
              </ReactTooltip>
            </>
          )}
        </div>
      )}
      <div
        className={cn(styles.InputWrapper, {
          [styles.WithIcon]: searchIcon || clearIcon,
        })}
      >
        <input
          placeholder={placeholder}
          disabled={disabled}
          type="text"
          onChange={handleChange}
          {...inputRestProps}
          data-cy={'input-field'}
        />
        {charLimit && (
          <div
            className={cn(styles.CharLimit, {
              [styles.Visible]: isCharLimitVisible,
              [styles.Highlighted]: value.length === charLimit,
            })}
          >
            {value.length}/{charLimit}
          </div>
        )}
        {(searchIcon || clearIcon) && (
          <div
            className={cn(styles.Icon, {
              [styles.WithCursor]: !!onIconClick && clearIcon,
            })}
            onClick={onIconClick}
          >
            {searchIcon && <SearchIcon />}
            {clearIcon && (
              <img
                className={styles.ClearIcon}
                src="/keepsimple_/assets/icons/crossRounded.svg"
                alt="clear icon"
                width={16}
                height={16}
              />
            )}
          </div>
        )}
        {validationFunction && (
          <div className={styles.Message}>{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default Input;

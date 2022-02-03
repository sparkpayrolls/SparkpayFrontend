/* eslint-disable no-unused-vars */
import {
  ChangeEvent,
  ChangeEventHandler,
  FocusEvent,
  useEffect,
  useState,
} from 'react';
import Image from 'next/image';
import eye from '../../../public/svgs/eye.svg';
import eye_off from '../../../public/svgs/eye-off.svg';
import { Spinner } from '../Spinner/Spinner.component';
interface InputProps {
  /**
   * Input Placeholder contents
   */
  placeholder?: string;
  /**
   * input type 'text' | 'email' | 'password'
   */
  type: 'text' | 'email' | 'password' | 'tel';
  /**
   * Input label content
   */
  label: string;

  /**
   * label htmlFor & input name
   */
  name: string;

  /**
   * custom class name
   */
  className?: string;

  /**
   * Input value (optional)
   */
  value?: string;

  /**
   * Input onChange function
   */
  onChange: ChangeEventHandler<HTMLInputElement>;

  /**
   * Input onBlur function when focus leaves input
   */
  onBlur?: {
    (e: FocusEvent<any>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };

  /**
   * boolean value when there is error in input
   */
  hasError?: boolean | '';

  /**
   * Input error message
   */
  error?: string;

  transformValue?: (val: string) => string;

  loading?: boolean;

  readOnly?: boolean;
}

/**
 * Input UI component for user interaction
 */
export const Input = ({
  label,
  type = 'text',
  name,
  value,
  className,
  hasError,
  error,
  loading,
  transformValue,
  onChange,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [valueInternal, setValueInternal] = useState(value || '');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (transformValue) {
      event.target.value = transformValue(event.target.value);
    }
    onChange(event);
    setValueInternal(event.target.value);
  };

  useEffect(() => {
    if (transformValue && value) {
      setValueInternal(transformValue(value));
    }
  }, [transformValue, value]);

  return (
    <>
      {type !== 'password' ? (
        <div className={['input-container', `${className}`].join(' ')}>
          <label htmlFor={name} className="input-label">
            {label}
          </label>
          <div className="input-container__input">
            <input
              type={type}
              className={['input', `${hasError ? 'input--error' : ''}`].join(
                ' ',
              )}
              name={name}
              value={valueInternal}
              onChange={handleChange}
              {...props}
            />
            {loading && (
              <div className="input-container__input__loader">
                <Spinner color="--green" />
              </div>
            )}
          </div>

          {hasError ? <span className="input-error">{error}</span> : null}
        </div>
      ) : (
        <div className={['input-container', `${className}`].join(' ')}>
          <label htmlFor={name} className="input-label">
            {label}
          </label>
          <div
            className={[
              'input-password-container',
              `${hasError ? 'input--error' : ''}`,
            ].join(' ')}
          >
            <input
              type={showPassword ? 'text' : 'password'}
              className="input"
              name={name}
              value={valueInternal}
              onChange={handleChange}
              {...props}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {!loading ? (
                <Image
                  src={showPassword ? eye_off : eye}
                  alt="eye icon"
                  width="20"
                  height="20"
                />
              ) : (
                <Spinner color="--green" />
              )}
            </button>
          </div>

          {hasError ? <span className="input-error">{error}</span> : null}
        </div>
      )}
    </>
  );
};

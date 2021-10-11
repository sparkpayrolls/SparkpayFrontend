/* eslint-disable no-unused-vars */
import { ChangeEvent, FocusEvent, useState } from 'react';
import Image from 'next/image';
import eye from '../../../public/svgs/eye.svg';
import eye_off from '../../../public/svgs/eye-off.svg';
interface InputProps {
  /**
   * Input Placeholder contents
   */
  placeholder?: string;
  /**
   * input type 'text' | 'email' | 'password'
   */
  type: 'text' | 'email' | 'password';
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
  onChange: {
    (e: ChangeEvent<any>): void;
    <T = string | ChangeEvent<any>>(field: T): T extends ChangeEvent<any>
      ? void
      : (e: string | ChangeEvent<any>) => void;
  };

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
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {type !== 'password' ? (
        <div className={['input-container', `${className}`].join(' ')}>
          <label htmlFor={name} className="input-label">
            {label}
          </label>
          <input
            type={type}
            className={['input', `${hasError ? 'input--error' : ''}`].join(' ')}
            name={name}
            value={value}
            {...props}
          />

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
              value={value}
              {...props}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <Image
                src={showPassword ? eye_off : eye}
                alt="eye icon"
                width="20"
                height="20"
              />
            </button>
          </div>

          {hasError ? <span className="input-error">{error}</span> : null}
        </div>
      )}
    </>
  );
};

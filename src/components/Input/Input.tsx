/* eslint-disable no-unused-vars */
import { ChangeEvent, FocusEvent } from 'react';

interface InputProps {
  /**
   * Input Placeholder contents
   */
  placeholder?: string;
  /**
   * How large should the button be?
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
  return (
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
  );
};

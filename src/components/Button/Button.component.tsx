import React from 'react';
import { Spinner } from '../Spinner/Spinner.component';

interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button contents
   */
  label: string | React.ReactElement;

  /**
   * Button type 'button' | 'submit'
   */
  type: 'button' | 'submit';
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Custom css className
   */
  className?: string;

  /**
   * Should the button be disabled
   */
  disabled?: boolean;

  /**
   * Should the button indicate loading
   */
  showSpinner?: boolean;

  /**
   * Should the button show loading
   */
  showLabel?: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary = false,
  size = 'medium',
  type = 'button',
  backgroundColor,
  label,
  className,
  showSpinner = false,
  showLabel = true,
  ...props
}: ButtonProps) => {
  const mode = primary ? 'button--primary' : 'button--secondary';
  return (
    <button
      type={type}
      className={['button', `button--${size}`, mode, className].join(' ')}
      style={{ backgroundColor }}
      {...props}
    >
      {showLabel && label}
      {showSpinner ? <Spinner /> : null}
    </button>
  );
};

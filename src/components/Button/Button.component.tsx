import React from 'react';
import Link from 'next/link';
import { Spinner } from '../Spinner/Spinner.component';
import { ButtonProps } from '../types';

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
  element,
  href,
  ...props
}: ButtonProps) => {
  const mode = primary ? 'button--primary' : 'button--secondary';

  if (element === 'a' && href) {
    return (
      <Link href={href}>
        <a
          type={type}
          className={['button', `button--${size}`, mode, className].join(' ')}
          style={{ backgroundColor }}
          {...props}
        >
          {showLabel && label}
          {showSpinner ? <Spinner /> : null}
        </a>
      </Link>
    );
  }

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

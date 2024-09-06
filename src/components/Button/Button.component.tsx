import React, { PropsWithChildren } from 'react';
import Link from 'next/link';
import { Spinner } from '../Spinner/Spinner.component';
import { ButtonProps } from '../types';
import classNames from 'classnames';

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
  danger,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  const mode = primary ? 'button--primary' : 'button--secondary';
  const buttonClassName = classNames(
    'button',
    `button--${size}`,
    mode,
    className,
    { 'button--danger': danger },
  );

  if (element === 'a' && href) {
    return (
      <Link href={href}>
        <a
          type={type}
          className={buttonClassName}
          style={{ backgroundColor }}
          {...props}
        >
          {showLabel && (label || props.children)}
          {showSpinner ? <Spinner /> : null}
        </a>
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClassName}
      style={{ backgroundColor }}
      {...props}
    >
      {showLabel && (label || props.children)}
      {showSpinner ? <Spinner /> : null}
    </button>
  );
};

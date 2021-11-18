import classNames from 'classnames';
import React from 'react';

interface SpinnerProps {
  /**
   * What color to use
   */
  color?: '--green';
}

/**
 * Primary UI component for user interaction
 */
export const Spinner = (props: SpinnerProps) => {
  const className = classNames('spinner', {
    [`spinner${props.color}`]: !!props.color,
  });

  return (
    <div className={className}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

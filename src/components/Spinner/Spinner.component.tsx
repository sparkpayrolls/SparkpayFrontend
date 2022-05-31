import classNames from 'classnames';
import React from 'react';

interface SpinnerProps {
  /**
   * What color to use
   */
  color?: '--green';
  size?: number;
}

/**
 * Primary UI component for user interaction
 */
export const Spinner = (props: SpinnerProps) => {
  const className = classNames('spinner', {
    [`spinner${props.color}`]: !!props.color,
  });
  const { size = 28 } = props;
  const sizeInner = Math.round(size * 0.643);
  const margin = Math.round(sizeInner * 0.278);

  return (
    <div className={className} style={{ width: size, height: size }}>
      <div style={{ width: sizeInner, height: sizeInner, margin }}></div>
      <div style={{ width: sizeInner, height: sizeInner, margin }}></div>
      <div style={{ width: sizeInner, height: sizeInner, margin }}></div>
      <div style={{ width: sizeInner, height: sizeInner, margin }}></div>
    </div>
  );
};

import classNames from 'classnames';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export const InputError = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
) => {
  const { className, ...otherProps } = props;
  const spanClass = classNames('input-error', className);

  return <span className={spanClass} {...otherProps} />;
};

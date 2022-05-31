import classNames from 'classnames';
import { DetailedHTMLProps, LabelHTMLAttributes } from 'react';

export const Label = (
  props: DetailedHTMLProps<
    LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >,
) => {
  const { className, ...otherProps } = props;
  const labelClass = classNames('label', className);

  return <label className={labelClass} {...otherProps} />;
};

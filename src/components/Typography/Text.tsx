import classNames from 'classnames';
import { ReactNode } from 'react';
import { ElementWrapper } from '../Table/check-box-table-col.component';

export interface IText {
  element?: string;
  className?: string;
  text?: string | ReactNode;
}

export const Text = (props: IText & Record<string, any>) => {
  const { className: c, element, text, ...otherProps } = props;
  const className = classNames('text', c);

  return (
    <ElementWrapper
      element={element || 'span'}
      className={className}
      {...otherProps}
    >
      {text}
    </ElementWrapper>
  );
};

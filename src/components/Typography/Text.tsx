import classNames from 'classnames';
import { ElementWrapper } from '../Table/check-box-table-col.component';

export interface IText {
  component?: string;
  element?: string;
  className?: string;
  variant?: 'heading-1' | 'heading-2' | 'heading-3' | 'body-text-1';
}

export const Text = (props: IText & Record<string, any>) => {
  const {
    className: c,
    element,
    component,
    variant = 'body-text-1',
    ...otherProps
  } = props;
  const className = classNames('text', c, variant);

  return (
    <ElementWrapper
      element={element || component || 'span'}
      className={className}
      {...otherProps}
    />
  );
};

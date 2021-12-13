import classNames from 'classnames';
import { ElementWrapper } from '../Table/check-box-table-col.component';
import { IText } from '../types';

export const Text = (props: IText) => {
  const className = classNames('text', props.className);

  return (
    <ElementWrapper element={props.element} className={className}>
      {props.text}
    </ElementWrapper>
  );
};

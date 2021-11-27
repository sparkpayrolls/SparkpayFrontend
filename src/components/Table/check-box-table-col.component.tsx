import { PropsWithChildren } from 'react';
import { ICheckboxTableColumn } from '../types';

export const ElementWrapper = (
  props: PropsWithChildren<{ element: string }>,
) => {
  switch (props.element) {
    case 'td':
      return <td>{props.children}</td>;
    case 'th':
      return <th>{props.children}</th>;
    default:
      return null;
  }
};

export const CheckboxTableColumn = (
  props: PropsWithChildren<ICheckboxTableColumn>,
) => {
  return (
    <ElementWrapper element={props.element}>
      <span className="checkbox-table-column">
        <span className="checkbox-table-column__checkbox">
          <input type="checkbox" />
        </span>
        <span className="checkbox-table-column__content">{props.children}</span>
      </span>
    </ElementWrapper>
  );
};

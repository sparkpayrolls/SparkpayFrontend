import { PropsWithChildren } from 'react';
import { ICheckboxTableColumn, IElementWrapper } from '../types';

export const ElementWrapper = (props: PropsWithChildren<IElementWrapper>) => {
  switch (props.element) {
    case 'td':
      return <td className={props.className}>{props.children}</td>;
    case 'th':
      return <th className={props.className}>{props.children}</th>;
    case 'p':
      return <p className={props.className}>{props.children}</p>;
    case 'span':
      return <span className={props.className}>{props.children}</span>;
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
          <input
            onChange={props.onChange}
            checked={props.checked}
            type="checkbox"
          />
        </span>
        <span className="checkbox-table-column__content">{props.children}</span>
      </span>
    </ElementWrapper>
  );
};

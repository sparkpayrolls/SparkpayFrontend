import React, { PropsWithChildren } from 'react';
import { ICheckboxTableColumn, IElementWrapper } from '../types';

export const ElementWrapper = (
  props: PropsWithChildren<IElementWrapper & Record<string, unknown>>,
) => {
  const { element, children, ...otherProps } = props;

  return React.createElement(element, otherProps, children);
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

import { PropsWithChildren } from 'react';
import { KebabMenu } from '../KebabMenu/KebabMenu.component';
import { IMenuTableColumn } from '../types';
import { ElementWrapper } from './check-box-table-col.component';

export const MenuTableColumn = (props: PropsWithChildren<IMenuTableColumn>) => {
  return (
    <ElementWrapper element={props.element}>
      <span className="menu-table-column">
        <span className="menu-table-column__content">{props.children}</span>
        <span className="menu-table-column__menu">
          <KebabMenu items={props.items} />
        </span>
      </span>
    </ElementWrapper>
  );
};

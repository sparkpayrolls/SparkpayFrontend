import { PropsWithChildren } from 'react';
import { Button } from '../Button/Button.component';
import { FilterButton } from '../Button/filter-button';
import { SearchInput } from '../Input/search-input.component';
import { KebabMenu } from '../KebabMenu/KebabMenu.component';
import { ITableLayout } from '../types';

export const TableLayout = (props: PropsWithChildren<ITableLayout>) => {
  return (
    <div className="table-layout">
      <div className="table-layout__top-bar">
        {props.title && (
          <p className="table-layout__top-bar__title">{props.title}</p>
        )}

        <div className="table-layout__top-bar__actions">
          {props.onSearch && <SearchInput onSearch={props.onSearch} />}

          {props.onFilter && <FilterButton onClick={props.onFilter} />}

          {props.menuItems && (
            <button className="table-layout__top-bar__actions__options-button">
              <KebabMenu items={props.menuItems} />
            </button>
          )}

          {props.buttons?.map((button, i) => {
            return (
              <Button
                key={`${button.label}-${i}`}
                label={button.label}
                type="button"
                element={button.href ? 'a' : undefined}
                href={button.href}
                onClick={button.action ? button.action : undefined}
                primary={button.primary}
              />
            );
          })}
        </div>
      </div>
      <div className="table-layout__container">{props.children}</div>
    </div>
  );
};

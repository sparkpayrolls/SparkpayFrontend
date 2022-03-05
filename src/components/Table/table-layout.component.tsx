import { PropsWithChildren, useCallback } from 'react';
import { Util } from 'src/helpers/util';
import { Button } from '../Button/Button.component';
import { FilterButton } from '../Button/filter-button';
import { SearchForm } from '../Form/search.form';
import { KebabMenu } from '../KebabMenu/KebabMenu.component';
import { ITableLayout } from '../types';

export const TableLayout = (props: PropsWithChildren<ITableLayout>) => {
  const showTopBar =
    props.onSearch ||
    props.searchPlaceholder ||
    props.onFilter ||
    props.menuItems ||
    props.buttons ||
    props.title;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearch = useCallback(
    Util.debounce((search: string) => {
      if (props.onSearch) {
        props.onSearch(search);
      }
    }, 500),
    [props.onSearch],
  );

  return (
    <div className="table-layout">
      {showTopBar && (
        <div className="table-layout__top-bar">
          {props.title && (
            <p className="table-layout__top-bar__title">{props.title}</p>
          )}

          <div className="table-layout__top-bar__actions">
            {(props.onSearch || props.searchPlaceholder) && (
              <div className="table-layout__top-bar__actions__search">
                <SearchForm
                  placeholder={props.searchPlaceholder}
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            )}

            {props.onFilter && <FilterButton onClick={props.onFilter} />}

            {props.menuItems && (
              <button className="table-layout__top-bar__actions__options-button">
                <KebabMenu items={props.menuItems} />
              </button>
            )}

            {props.buttons?.map(({ href, action, ...spread }, i) => {
              return (
                <Button
                  key={`table-layout-button-${i}`}
                  element={href ? 'a' : undefined}
                  href={href}
                  onClick={action ? action : undefined}
                  {...spread}
                />
              );
            })}
          </div>
        </div>
      )}
      <div className="table-layout__container">{props.children}</div>
    </div>
  );
};

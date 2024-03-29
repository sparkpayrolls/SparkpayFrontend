import classNames from 'classnames';
import { PropsWithChildren, useCallback, useEffect, useRef } from 'react';
import { Util } from 'src/helpers/util';
import { Button } from '../Button/Button.component';
import { FilterButton } from '../Button/filter-button';
import { SearchForm } from '../Form/search.form';
import { IKebabItem, KebabMenu } from '../KebabMenu/KebabMenu.component';
import { IF } from '../Misc/if.component';
import { ITableLayout } from '../types';

export const TableLayout = (props: PropsWithChildren<ITableLayout>) => {
  const showTopBar =
    !!props.onSearch ||
    !!props.searchPlaceholder ||
    !!props.onFilter ||
    !!props.menuItems ||
    !!props.buttons ||
    !!props.title;
  const className = classNames('table-layout', {
    'table-layout--fixed-header': props.fixedHeader,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearch = useCallback(
    Util.debounce((search: string) => {
      if (props.onSearch) {
        props.onSearch(search);
      }
    }, props.searchDelay || 500),
    [props.onSearch, props.searchDelay],
  );
  useEffect(() => {
    const container = containerRef.current;
    if (container && props.fixedHeader) {
      const clonedContainer = container.cloneNode(true) as any;
      clonedContainer.classList.add('table-layout--fixed-header__dup-table');
      container.appendChild(clonedContainer);
      const headerHeight = clonedContainer.querySelector('thead')?.clientHeight;

      const tableContainer = container.querySelector(
        '.table-layout__table-container',
      );
      const clonedTableContainer = clonedContainer.querySelector(
        '.table-layout__table-container',
      );

      const syncScroll = () => {
        clonedTableContainer.scrollLeft = tableContainer?.scrollLeft;
      };
      tableContainer?.addEventListener('scroll', syncScroll, { passive: true });
      clonedTableContainer.style.height = `${headerHeight}px`;

      return () => {
        container.removeChild(clonedContainer);
        tableContainer?.removeEventListener('scroll', syncScroll);
      };
    }
  }, [containerRef, props.children, props.fixedHeader]);

  return (
    <div className={className}>
      <IF condition={showTopBar}>
        <div className="table-layout__top-bar">
          <IF condition={!!props.title}>
            <p className="table-layout__top-bar__title">{props.title}</p>
          </IF>

          <div className="table-layout__top-bar__actions">
            <IF condition={!!props.onSearch || !!props.searchPlaceholder}>
              <div className="table-layout__top-bar__actions__search">
                <SearchForm
                  placeholder={props.searchPlaceholder}
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            </IF>

            <IF condition={!!props.onFilter}>
              <FilterButton onClick={props.onFilter} />
            </IF>

            <IF condition={!!props.menuItems}>
              <button className="table-layout__top-bar__actions__options-button">
                <KebabMenu items={props.menuItems as IKebabItem[]} />
              </button>
            </IF>

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
      </IF>

      <div ref={containerRef} className="table-layout__container">
        <div className="table-layout__table-container">{props.children}</div>
      </div>
    </div>
  );
};

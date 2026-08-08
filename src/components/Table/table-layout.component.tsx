import classNames from 'classnames';
import { PropsWithChildren, useCallback, useEffect, useRef } from 'react';
import { Util } from 'src/helpers/util';
import { Button } from '../Button/Button.component';
import { FilterButton } from '../Button/filter-button';
import { SearchForm } from '../Form/search.form';
import { IKebabItem, KebabMenu } from '../KebabMenu/KebabMenu.component';
import { IF } from '../Misc/if.component';
import { ITableLayout } from '../types';
import { TableV2 } from './Table.component';

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
  const dupTableRef = useRef<HTMLDivElement>(null);

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
      let headerHeight = 0;
      let clonedContainer: HTMLDivElement;
      let shouldRemove = false;

      if (typeof props.fixedHeader !== 'boolean') {
        clonedContainer = dupTableRef.current as HTMLDivElement;
        headerHeight =
          clonedContainer?.querySelector('thead')?.clientHeight || 0;
      } else {
        clonedContainer = container.cloneNode(true) as HTMLDivElement;

        clonedContainer.classList.add('table-layout--fixed-header__dup-table');
        container.appendChild(clonedContainer);

        headerHeight = clonedContainer.querySelector('thead')
          ?.clientHeight as number;
        shouldRemove = true;
      }

      const tableContainer = container.querySelector(
        '.table-layout__table-container',
      ) as HTMLTableElement;
      const clonedTableContainer = clonedContainer.querySelector(
        '.table-layout__table-container',
      ) as HTMLDivElement;

      const syncScroll = () => {
        clonedTableContainer.scrollLeft = tableContainer?.scrollLeft as number;
      };
      tableContainer?.addEventListener('scroll', syncScroll, { passive: true });
      clonedTableContainer.style.height = `${headerHeight}px`;

      return () => {
        if (shouldRemove && container?.contains(clonedContainer)) {
          container?.removeChild(clonedContainer);
        }
        tableContainer?.removeEventListener('scroll', syncScroll);
      };
    }
  }, [containerRef, dupTableRef, props.children, props.fixedHeader]);

  return (
    <div className={className}>
      <IF condition={showTopBar}>
        <div
          className="table-layout__top-bar"
          style={
            props.fixedTitle
              ? { position: 'sticky', top: 0, zIndex: 1, background: 'white' }
              : {}
          }
        >
          <IF condition={!!props.title}>
            <div
              className="table-layout__top-bar__title"
              style={props.fixedTitle ? { width: '100%' } : {}}
            >
              {props.title}
            </div>
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
              <FilterButton
                className={props.filterButtonClassName}
                onClick={props.onFilter}
              />
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

        {typeof props.fixedHeader === 'object' && (
          <div
            className="table-layout__container table-layout--fixed-header__dup-table"
            ref={dupTableRef}
          >
            <div className="table-layout__table-container">
              <TableV2 {...props.fixedHeader.props} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

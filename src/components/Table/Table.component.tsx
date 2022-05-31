/* eslint-disable no-unused-vars */
import classNames from 'classnames';
import Image from 'next/image';
import { ChangeEvent, PropsWithChildren, useState } from 'react';
import { Util } from 'src/helpers/util';
import search_icon from '../../../public/svgs/search-icon.svg';
import { Button } from '../Button/Button.component';
import { SelectInput } from '../Input/seletct-input';
import { KebabMenu } from '../KebabMenu/KebabMenu.component';
import { ITable, ITablePagination, ITablev2, ITR } from '../types';
import { Dropdown } from 'antd';
import { SearchForm } from '../Form/search.form';

export const TR = (props: PropsWithChildren<ITR>) => {
  return (
    <tr>
      <th>
        <input
          type="checkbox"
          checked={props.checked}
          onChange={props.onChange}
        />
      </th>
      {props.children}
    </tr>
  );
};

const TablePagination = (props: ITablePagination) => {
  if (props.total < 11) {
    return null;
  }

  const refresh = (page: number, perPage: number, all?: boolean) => {
    props.refresh && props.refresh(page, perPage, all);
  };

  const handlePerPageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === 'all') {
      return refresh(1, props.perPage, true);
    }
    const numberOfPages = Math.ceil(props.total / +value);
    const newPage = props.page > numberOfPages ? numberOfPages : props.page;

    refresh(newPage, +value);
  };

  return (
    <div className="table-component__pagination">
      <div className="table-component__pagination--page-summary">
        <span>Showing</span> Page {props.page} of {props.pageCount}
      </div>

      <div className="table-component__pagination--per-page d-flex align-items-center">
        <span>Items per page: </span>
        <SelectInput
          options={[
            { value: '10' },
            { value: '100' },
            { value: '1000' },
            { value: 'all' },
          ]}
          displayValue="value"
          actualValue="value"
          onChange={handlePerPageSelect}
          selected={{ value: String(props.perPage) }}
          dropTop
        />
      </div>

      <div className="table-component__pagination--btns">
        <button
          disabled={!props.hasPrevPage}
          onClick={() => refresh(props.previousPage || 1, props.perPage)}
          className="prev"
        >
          Prev
        </button>
        <button
          onClick={() => refresh(1, props.perPage)}
          disabled={props.page === 1}
        >
          1
        </button>
        {props.page - 3 > 0 && <button>...</button>}
        {props.page === props.pageCount && props.pageCount > 3 && (
          <button onClick={() => refresh(props.page - 2, props.perPage)}>
            {props.page - 2}
          </button>
        )}
        {props.page - 2 > 0 && props.page !== props.pageCount - 2 && (
          <button onClick={() => refresh(props.page - 1, props.perPage)}>
            {props.page - 1}
          </button>
        )}
        {props.page - 1 > 0 && props.page + 1 <= props.pageCount && (
          <button disabled>{props.page}</button>
        )}
        {props.page + 2 <= props.pageCount && props.page !== 3 && (
          <button onClick={() => refresh(props.page + 1, props.perPage)}>
            {props.page + 1}
          </button>
        )}
        {props.page === 1 && props.pageCount > 3 && (
          <button onClick={() => refresh(3, props.perPage)}>3</button>
        )}
        {props.page + 3 <= props.pageCount && <button>...</button>}
        {props.pageCount !== 1 && (
          <button
            onClick={() => refresh(props.pageCount, props.perPage)}
            disabled={props.page === props.pageCount}
          >
            {props.pageCount}
          </button>
        )}
        <button
          className="next"
          onClick={() => refresh(props.nextPage || 1, props.perPage)}
          disabled={!props.hasNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const searchFunc = Util.debounce(
  (func: (_?: number, _1?: number, _2?: string) => void, search: string) => {
    func(undefined, undefined, search);
  },
  500,
);

export const Table = (props: ITable) => {
  const [search, setSearch] = useState('');

  const refresh = (page?: number, perPage?: number, all?: boolean) => {
    props.refresh && props.refresh(page, perPage, search, all);
  };

  const menu = (
    <SearchForm
      placeholder="Search by name"
      onChange={(event) => {
        setSearch(event.target.value);
        searchFunc(props.refresh || (() => {}), event.target.value);
      }}
    />
  );

  return (
    <div
      className={`table-component${
        props.isLoading ? ' table-component--loading' : ''
      }`}
    >
      {(!!props.title ||
        !props.isNotSearchable ||
        !!props.onFilterClick ||
        !!props.kebabMenuItems?.length) && (
        <div className="table-component__tool-bar">
          {props.title && (
            <p className="table-component__table-title">{props.title}</p>
          )}

          {!props.isNotSearchable && (
            <div
              style={{
                // minWidth: '45%',
                display: 'flex',
                gridColumnGap: 16,
                alignItems: 'center',
              }}
            >
              <div className="table-component__search">
                <SearchForm
                  placeholder="Search by name"
                  onChange={(event) => {
                    setSearch(event.target.value);
                    searchFunc(props.refresh || (() => {}), event.target.value);
                  }}
                />
              </div>

              <Dropdown
                overlay={menu}
                trigger={['click']}
                overlayClassName="employee-dropdown"
              >
                <button className="table-component__search-btn">
                  <Image src={search_icon} alt="search icon" />
                </button>
              </Dropdown>

              {props.onFilterClick && (
                <button
                  className="table-component__filter-btn"
                  onClick={props.onFilterClick}
                >
                  <span>Filter</span> <FilterSVG />
                </button>
              )}

              {!!props.kebabMenuItems?.length && (
                <div className="table-component__option-btn">
                  {/* <KebabMenuSVG /> */}
                  <KebabMenu items={props.kebabMenuItems} />
                </div>
              )}
            </div>
          )}
          {props.buttons && (
            <div className="table-component__buttons">
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
          )}
        </div>
      )}

      <div className="table-component__table-container">
        <table>
          <thead className="table-component__thead">
            {!props.isNotSelectable && (
              <TR checked={props.allChecked} onChange={props.onCheckAllClick}>
                {props.headerRow.map((item) => {
                  return <th key={item}>{item}</th>;
                })}
              </TR>
            )}
            {props.isNotSelectable && (
              <tr>
                {props.headerRow.map((item) => {
                  return <th key={item}>{item}</th>;
                })}
              </tr>
            )}
          </thead>

          {props.children()}
        </table>
        {props.isEmpty && (
          <div className="table-component__empty-state">
            <FileStorageSVG />
            <span className="table-component__empty-state--text">
              {props.isLoading
                ? 'Getting data'
                : props.emptyStateText ?? 'No data'}
            </span>
          </div>
        )}
      </div>

      {props.paginationMeta && !props.isEmpty && (
        <TablePagination {...props.paginationMeta} refresh={refresh} />
      )}
    </div>
  );
};

const FilterSVG = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.11325 10.9998C3.25099 10.6095 3.50641 10.2715 3.84432 10.0324C4.18223 9.79327 4.58598 9.66488 4.99992 9.66488C5.41386 9.66488 5.81761 9.79327 6.15552 10.0324C6.49343 10.2715 6.74885 10.6095 6.88659 10.9998H13.6666V12.3332H6.88659C6.74885 12.7235 6.49343 13.0616 6.15552 13.3007C5.81761 13.5397 5.41386 13.6681 4.99992 13.6681C4.58598 13.6681 4.18223 13.5397 3.84432 13.3007C3.50641 13.0616 3.25099 12.7235 3.11325 12.3332H0.333252V10.9998H3.11325ZM7.11325 6.33318C7.25099 5.94282 7.50641 5.6048 7.84432 5.3657C8.18223 5.12661 8.58598 4.99821 8.99992 4.99821C9.41386 4.99821 9.81761 5.12661 10.1555 5.3657C10.4934 5.6048 10.7489 5.94282 10.8866 6.33318H13.6666V7.66651H10.8866C10.7489 8.05687 10.4934 8.39489 10.1555 8.63398C9.81761 8.87308 9.41386 9.00148 8.99992 9.00148C8.58598 9.00148 8.18223 8.87308 7.84432 8.63398C7.50641 8.39489 7.25099 8.05687 7.11325 7.66651H0.333252V6.33318H7.11325ZM3.11325 1.66651C3.25099 1.27615 3.50641 0.938133 3.84432 0.699036C4.18223 0.45994 4.58598 0.331543 4.99992 0.331543C5.41386 0.331543 5.81761 0.45994 6.15552 0.699036C6.49343 0.938133 6.74885 1.27615 6.88659 1.66651H13.6666V2.99984H6.88659C6.74885 3.3902 6.49343 3.72822 6.15552 3.96732C5.81761 4.20641 5.41386 4.33481 4.99992 4.33481C4.58598 4.33481 4.18223 4.20641 3.84432 3.96732C3.50641 3.72822 3.25099 3.3902 3.11325 2.99984H0.333252V1.66651H3.11325ZM4.99992 2.99984C5.17673 2.99984 5.3463 2.92961 5.47132 2.80458C5.59635 2.67956 5.66659 2.50999 5.66659 2.33318C5.66659 2.15637 5.59635 1.9868 5.47132 1.86177C5.3463 1.73675 5.17673 1.66651 4.99992 1.66651C4.82311 1.66651 4.65354 1.73675 4.52851 1.86177C4.40349 1.9868 4.33325 2.15637 4.33325 2.33318C4.33325 2.50999 4.40349 2.67956 4.52851 2.80458C4.65354 2.92961 4.82311 2.99984 4.99992 2.99984ZM8.99992 7.66651C9.17673 7.66651 9.3463 7.59627 9.47132 7.47125C9.59635 7.34622 9.66659 7.17665 9.66659 6.99984C9.66659 6.82303 9.59635 6.65346 9.47132 6.52844C9.3463 6.40342 9.17673 6.33318 8.99992 6.33318C8.82311 6.33318 8.65354 6.40342 8.52851 6.52844C8.40349 6.65346 8.33325 6.82303 8.33325 6.99984C8.33325 7.17665 8.40349 7.34622 8.52851 7.47125C8.65354 7.59627 8.82311 7.66651 8.99992 7.66651ZM4.99992 12.3332C5.17673 12.3332 5.3463 12.2629 5.47132 12.1379C5.59635 12.0129 5.66659 11.8433 5.66659 11.6665C5.66659 11.4897 5.59635 11.3201 5.47132 11.1951C5.3463 11.0701 5.17673 10.9998 4.99992 10.9998C4.82311 10.9998 4.65354 11.0701 4.52851 11.1951C4.40349 11.3201 4.33325 11.4897 4.33325 11.6665C4.33325 11.8433 4.40349 12.0129 4.52851 12.1379C4.65354 12.2629 4.82311 12.3332 4.99992 12.3332Z"
      fill="#3A434B"
    />
  </svg>
);

const FileStorageSVG = () => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0)">
      <path
        d="M90.0148 33.0825H43.09C41.5263 33.0823 40.0324 32.4352 38.963 31.2945L32.9152 24.8468C31.8439 23.7051 30.3477 23.0582 28.782 23.0601H9.08255C5.95737 23.0601 3.42383 25.5936 3.42383 28.7188V91.8285C3.42383 94.9572 5.96006 97.4935 9.08876 97.4935H90.0039C93.1326 97.4935 95.6688 94.9572 95.6688 91.8285V38.7414C95.6688 35.6179 93.1382 33.0852 90.0148 33.0825Z"
        fill="#EAB54E"
      />
      <path
        d="M16.9678 3.791C16.9678 3.08124 17.5432 2.50586 18.2529 2.50586H84.4536C85.1634 2.50586 85.7387 3.08124 85.7387 3.791V62.7962C85.7387 63.506 85.1634 64.0814 84.4536 64.0814H18.2529C17.5431 64.0814 16.9678 63.506 16.9678 62.7962V3.791Z"
        fill="#D4E1F4"
      />
      <path
        d="M13.3579 9.50828C13.3579 8.79852 13.9333 8.22314 14.6431 8.22314H78.7497C79.4595 8.22314 80.0349 8.79852 80.0349 9.50829V66.4207C80.0349 67.1305 79.4595 67.7059 78.7497 67.7059H14.643C13.9333 67.7059 13.3579 67.1305 13.3579 66.4207V9.50828Z"
        fill="#F3F7FC"
      />
      <path
        d="M20.8975 16.7871C20.8975 16.2348 21.3452 15.7871 21.8975 15.7871H71.4981C72.0504 15.7871 72.4981 16.2348 72.4981 16.7871V17.4945C72.4981 18.0468 72.0504 18.4945 71.4981 18.4945H21.8975C21.3452 18.4945 20.8975 18.0468 20.8975 17.4945V16.7871Z"
        fill="#D4E1F4"
      />
      <path
        d="M20.8975 25.3877C20.8975 24.8354 21.3452 24.3877 21.8975 24.3877H71.4981C72.0504 24.3877 72.4981 24.8354 72.4981 25.3877V26.0951C72.4981 26.6474 72.0504 27.0951 71.4981 27.0951H21.8975C21.3452 27.0951 20.8975 26.6474 20.8975 26.0951V25.3877Z"
        fill="#D4E1F4"
      />
      <path
        d="M20.8975 33.9878C20.8975 33.4355 21.3452 32.9878 21.8975 32.9878H71.4981C72.0504 32.9878 72.4981 33.4355 72.4981 33.9878V34.6952C72.4981 35.2474 72.0504 35.6952 71.4981 35.6952H21.8975C21.3452 35.6952 20.8975 35.2474 20.8975 34.6952V33.9878Z"
        fill="#D4E1F4"
      />
      <path
        d="M94.3442 42.1611H43.0837C41.524 42.1611 40.0334 42.8049 38.964 43.9404L32.9137 50.3637C31.8445 51.4992 30.3539 52.143 28.794 52.143H5.65893C2.53375 52.1432 0.000206938 54.6765 0 57.8017C0 57.9737 0.00786365 58.1455 0.023384 58.3166L2.95032 92.3422C3.21644 95.2594 5.66266 97.4925 8.59207 97.4925H90.4976C93.4272 97.4925 95.8736 95.2588 96.1394 92.3412L99.976 48.3358C100.261 45.2236 97.9689 42.4697 94.8568 42.1847C94.6862 42.1692 94.5153 42.1613 94.3442 42.1611Z"
        fill="#F6C863"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="100" height="100" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const TableV2 = (props: PropsWithChildren<ITablev2>) => {
  const { loading, className, ...tableProps } = props;

  const tableClass = classNames('table', className, {
    'table--loading': loading,
  });

  return <table className={tableClass} {...tableProps} />;
};

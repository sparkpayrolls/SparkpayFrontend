import {
  ChangeEventHandler,
  MouseEventHandler,
  PropsWithChildren,
  ReactElement,
  useState,
} from 'react';
import { PaginationMeta } from 'src/api/types';
import { Util } from 'src/helpers/util';

interface ITable {
  // eslint-disable-next-line no-unused-vars
  children: () => ReactElement;
  onCheckAllClick?: ChangeEventHandler<HTMLInputElement>;
  headerRow: string[];
  allChecked?: boolean;
  paginationMeta?: PaginationMeta;
  // eslint-disable-next-line no-unused-vars
  refresh?: (page?: number, perPage?: number, search?: string) => void;
  title?: string;
  // eslint-disable-next-line no-unused-vars
  onSearch?: (_: string) => void;
  onFilterClick?: MouseEventHandler<HTMLButtonElement>;
}

interface ITR {
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

type ITablePagination = PaginationMeta & {
  // eslint-disable-next-line no-unused-vars
  refresh?: (page?: number, perPage?: number) => void;
};

export const TR = (props: PropsWithChildren<ITR>) => {
  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={props.checked}
          onChange={props.onChange}
        />
      </td>
      {props.children}
    </tr>
  );
};

const TablePagination = (props: ITablePagination) => {
  const refresh = (page: number) => {
    props.refresh && props.refresh(page, props.perPage);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>
        Showing Page {props.page} of {props.pageCount}
      </span>

      <div>
        <button
          disabled={!props.hasPrevPage}
          onClick={() => refresh(props.previousPage || 1)}
        >
          Prev
        </button>
        <button onClick={() => refresh(1)} disabled={props.page === 1}>
          1
        </button>
        {props.page - 4 > 0 && <button>...</button>}
        {props.page - 3 > 0 && (
          <button onClick={() => refresh(props.page - 2)}>
            {props.page - 2}
          </button>
        )}
        {props.page - 2 > 0 && (
          <button onClick={() => refresh(props.page - 1)}>
            {props.page - 1}
          </button>
        )}
        {props.page - 1 > 0 && props.page + 1 <= props.pageCount && (
          <button disabled>{props.page}</button>
        )}
        {props.page + 2 <= props.pageCount && (
          <button onClick={() => refresh(props.page + 1)}>
            {props.page + 1}
          </button>
        )}
        {props.page + 3 <= props.pageCount && (
          <button onClick={() => refresh(props.page + 2)}>
            {props.page + 2}
          </button>
        )}
        {props.page + 4 <= props.pageCount && <button>...</button>}
        {props.pageCount !== 1 && (
          <button
            onClick={() => refresh(props.pageCount)}
            disabled={props.page === props.pageCount}
          >
            {props.pageCount}
          </button>
        )}
        <button
          onClick={() => refresh(props.nextPage || 1)}
          disabled={!props.hasNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const searchFunc = Util.debounce(
  // eslint-disable-next-line no-unused-vars
  (func: (_?: number, _1?: number, _2?: string) => void, search: string) => {
    func(undefined, undefined, search);
  },
  500,
);

export const Table = (props: ITable) => {
  const [search, setSearch] = useState('');

  const refresh = (page?: number, perPage?: number) => {
    props.refresh && props.refresh(page, perPage, search);
  };

  return (
    <div>
      <div
        style={{
          paddingTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {props.title && <p>{props.title}</p>}

        <div
          style={{
            minWidth: '45%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <input
            type="search"
            placeholder="Search by name"
            style={{ minWidth: '60%' }}
            onChange={(event) => {
              setSearch(event.target.value);
              searchFunc(props.refresh || (() => {}), event.target.value);
            }}
          />

          <button onClick={props.onFilterClick}>Filter</button>

          <button>options</button>
        </div>
      </div>

      <table>
        <thead>
          <TR checked={props.allChecked} onChange={props.onCheckAllClick}>
            {props.headerRow.map((item) => {
              return <td key={item}>{item}</td>;
            })}
          </TR>
        </thead>

        {props.children()}
      </table>

      {props.paginationMeta && (
        <TablePagination {...props.paginationMeta} refresh={refresh} />
      )}
    </div>
  );
};

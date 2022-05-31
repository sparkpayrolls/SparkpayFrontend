import { ChangeEvent } from 'react';
import { SelectInput } from '../Input/seletct-input';
import { IPagination } from '../types';

export const Pagination = (props: IPagination) => {
  const {
    perPage = 10,
    total = 0,
    page = 1,
    pageCount = 1,
    hasPrevPage = false,
    hasNextPage = false,
    previousPage = null,
    nextPage = null,
  } = props.meta || {};
  if (total < 11) {
    return null;
  }

  const {
    refresh = () => {},
    perPageItems = ['10', '100', '1000', 'all'],
  } = props;

  const handlePerPageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === 'all') {
      return refresh({ page: 1, perPage, all: true });
    }
    const numberOfPages = Math.ceil(total / +value);
    const newPage = page > numberOfPages ? numberOfPages : page;

    refresh({ page: newPage, perPage: value });
  };

  return (
    <div className="pagination">
      <div className="pagination__summary">
        <span>Showing</span> Page {page} of {pageCount}
      </div>

      <div className="pagination__per-page d-flex align-items-center">
        <span>Items per page: </span>
        <SelectInput
          options={perPageItems.map((value) => ({ value }))}
          displayValue="value"
          actualValue="value"
          onChange={handlePerPageSelect}
          selected={{ value: String(perPage) }}
          dropTop
        />
      </div>

      <div className="pagination__buttons">
        <button
          disabled={!hasPrevPage}
          onClick={() => refresh({ page: previousPage, perPage })}
          className="prev"
        >
          Prev
        </button>
        <button
          onClick={() => refresh({ page: 1, perPage })}
          disabled={page === 1}
        >
          1
        </button>
        {page - 3 > 0 && <button>...</button>}
        {page === pageCount && pageCount > 3 && (
          <button onClick={() => refresh({ page: page - 2, perPage })}>
            {page - 2}
          </button>
        )}
        {page - 2 > 0 && page !== pageCount - 2 && (
          <button onClick={() => refresh({ page: page - 1, perPage })}>
            {page - 1}
          </button>
        )}
        {page - 1 > 0 && page + 1 <= pageCount && (
          <button disabled>{page}</button>
        )}
        {page + 2 <= pageCount && page !== 3 && (
          <button onClick={() => refresh({ page: page + 1, perPage })}>
            {page + 1}
          </button>
        )}
        {page === 1 && pageCount > 3 && (
          <button onClick={() => refresh({ page: 3, perPage })}>3</button>
        )}
        {page + 3 <= pageCount && <button>...</button>}
        {pageCount !== 1 && (
          <button
            onClick={() => refresh({ page: pageCount, perPage })}
            disabled={page === pageCount}
          >
            {pageCount}
          </button>
        )}
        <button
          className="next"
          onClick={() => refresh({ page: nextPage, perPage })}
          disabled={!hasNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

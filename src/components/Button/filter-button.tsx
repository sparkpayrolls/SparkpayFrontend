import { FilterSVG } from '../svg';

export const FilterButton = (props: { onClick?(): any }) => {
  return (
    <button className="filter-button" onClick={props.onClick}>
      <span className="filter-button__text">Filter</span>{' '}
      <span className="fiter-button__icon">
        <FilterSVG />
      </span>
    </button>
  );
};

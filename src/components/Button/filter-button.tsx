import classNames from 'classnames';
import { FilterSVG } from '../svg';

export const FilterButton = (props: {
  onClick?(): any;
  className?: string;
}) => {
  return (
    <button
      className={classNames('filter-button', props.className)}
      onClick={props.onClick}
    >
      <span className="filter-button__text">Filter</span>{' '}
      <span className="fiter-button__icon">
        <FilterSVG />
      </span>
    </button>
  );
};

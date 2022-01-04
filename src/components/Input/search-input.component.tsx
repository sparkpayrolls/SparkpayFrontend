import { Util } from 'src/helpers/util';
import { SearchSVG } from '../svg';
import { IOnSearch, ISearchInput } from '../types';

const onSearchDebounced = Util.debounce(
  (search: string, onSearch?: IOnSearch) => {
    if (onSearch) {
      onSearch(search);
    }
  },
  500,
);

export const SearchInput = (props: ISearchInput) => {
  return (
    <span className="search-input">
      <input
        type="search"
        placeholder={props.placeholder}
        className="search-input__input"
        value={props.value}
        onChange={(event) => {
          onSearchDebounced(event.target.value, props.onSearch);
        }}
      />
      <span className="search-input__icon">
        <SearchSVG />
      </span>
    </span>
  );
};

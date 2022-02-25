import Image from 'next/image';
import { ChangeEventHandler, FormEventHandler } from 'react';
import search_icon from '../../../public/svgs/search.svg';
import { InputV2 } from '../Input/Input.component';

interface ISearchForm {
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string | number | readonly string[];
  onSubmit?: FormEventHandler<HTMLFormElement>;
}

export const SearchForm = (props: ISearchForm) => {
  const {
    placeholder = 'Search...',
    onChange,
    value,
    onSubmit = (e) => {
      e.preventDefault();
    },
  } = props;
  return (
    <form className="search-component" onSubmit={onSubmit}>
      <InputV2
        value={value}
        type="search"
        placeholder={placeholder}
        onChange={onChange}
      />
      <Image src={search_icon} alt="search icon" className="search-icon" />
    </form>
  );
};

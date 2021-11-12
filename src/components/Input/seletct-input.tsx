import { DetailedHTMLProps, SelectHTMLAttributes, useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import { IMultiSelect, IMultiSelectOptionItem } from '../types';

type SelectOption = {
  value: string;
  text: string;
  id: string;
};

type SelectInputProps = {
  options: SelectOption[];
  error?: string;
  hasError?: boolean;
} & DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;

export const SelectInput = ({
  options,
  error,
  hasError,
  ...props
}: SelectInputProps) => {
  return (
    <>
      <select {...props}>
        <option value="">{props.placeholder}</option>
        {options.map((option) => {
          return (
            <option key={option.id} value={option.value}>
              {option.text}
            </option>
          );
        })}
      </select>
      {hasError && <span>{error}</span>}
    </>
  );
};

export const MultiSelectInput = (props: IMultiSelect) => {
  const [placeholder, setPlaceholder] = useState('Select');

  const getHandlerFor = (toCall: 'onSelect' | 'onRemove') => (
    selectedItems: IMultiSelectOptionItem[],
    selectedItem: IMultiSelectOptionItem,
  ) => {
    // @ts-ignore
    props[toCall] && props[toCall](selectedItems, selectedItem);
    if (selectedItems.length) {
      setPlaceholder('');
    } else {
      setPlaceholder('Select');
    }
  };

  return (
    <div className="multi-select-input">
      <label>{props.label}</label>
      <Multiselect
        options={props.options}
        onSelect={getHandlerFor('onSelect')}
        onRemove={getHandlerFor('onRemove')}
        displayValue={props.displayValue}
        placeholder={placeholder}
        selectedValues={props.selectedValues}
      />
    </div>
  );
};

import classNames from 'classnames';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import {
  IMultiSelect,
  IMultiSelectOptionItem,
  ISelectInput,
  ISelectInputOptionItem,
  ISelectOption,
} from '../types';

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

const Option = (props: PropsWithChildren<ISelectOption>) => {
  const { children, isSelected, onClick } = props;
  const className = classNames('select-input__option', {
    'select-input__option--selected': isSelected,
  });

  return (
    <span className={className} onClick={onClick}>
      {children}
    </span>
  );
};

export const SelectInput = (props: ISelectInput) => {
  const selectRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [selected, setSelected] = useState<ISelectInputOptionItem>({});
  const [hasShownOptions, setHasShownOptions] = useState(false);

  let inputId = `select-input-${Math.random().toString().substr(2, 5)}`;
  const className = classNames('select-input', {
    'select-input--open': showOptions,
    'select-input--dirty': !!Object.keys(selected).length,
    'select-input--has-error': !!props.error,
  });

  const handleOptionClick = (option: ISelectInputOptionItem) => {
    setSelected(option);
    setShowOptions(false);
    triggerChangeEvent();
  };

  const triggerChangeEvent = () => {
    if (inputRef.current) {
      inputRef.current.addEventListener('change', (event) => {
        if (props.onChange) {
          props.onChange(event as any);
        }
      });
      inputRef.current.value = selected[props.actualValue] as string;
      const event = new Event('change');
      inputRef.current.dispatchEvent(event);
    }
  };

  useEffect(() => {
    if (!showOptions && hasShownOptions) {
      inputRef.current?.focus();
      inputRef.current?.blur();
    }

    if (!hasShownOptions && showOptions) {
      setHasShownOptions(true);
    }
  }, [inputRef, showOptions, hasShownOptions]);

  useEffect(() => {
    const element = selectRef.current;

    const handleClickOutside = (event: MouseEvent) => {
      // @ts-ignore
      if (!event?.target?.closest(`#${element?.id}`)) {
        setShowOptions(false);
      }
    };
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [selectRef]);

  return (
    <span ref={selectRef} className={className} id={inputId}>
      <label>{props.label}</label>
      <span
        className="select-input__selector"
        onClick={() => setShowOptions(!showOptions)}
      >
        <span className="select-input__search">
          <input
            autoComplete="off"
            type="search"
            className="select-search-input"
            role="combobox"
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls={`${props.name}_list`}
            aria-activedescendant={`${props.name}_list`}
            unselectable="on"
            name={props.name}
            value={props.value}
            onChange={props.onChange}
            onBlur={props.onBlur}
            aria-expanded={showOptions}
            readOnly
            ref={inputRef}
          />
        </span>
        <span className="select-input__placeholder">
          {(selected[props.displayValue] as string) || 'Select'}
        </span>
        <span className="select-input__svg">
          <SelectInputSVG />
        </span>
      </span>
      {!!props.error && (
        <span className="select-input__error-message">{props.error}</span>
      )}
      <span
        role="listbox"
        id={`${inputId}_list`}
        className="select-input__options"
      >
        {props.options.map((value, index) => {
          return (
            <Option
              key={`${inputId}-${index}`}
              isSelected={
                selected[props.actualValue] === value[props.actualValue]
              }
              onClick={() => handleOptionClick(value)}
            >
              {value[props.displayValue] as string}
            </Option>
          );
        })}
      </span>
    </span>
  );
};

const SelectInputSVG = () => (
  <svg
    width="12"
    height="8"
    viewBox="0 0 12 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.35332 3.18157C6.15806 2.98631 5.84148 2.98631 5.64622 3.18157L1.75677 7.07101C1.3663 7.46148 0.733234 7.46148 0.342769 7.07102C-0.0476971 6.68055 -0.0476961 6.04748 0.342769 5.65702L5.29266 0.707121C5.68319 0.316597 6.31635 0.316598 6.70688 0.707122L11.6568 5.65702C12.0472 6.04748 12.0472 6.68055 11.6568 7.07102C11.2663 7.46148 10.6332 7.46148 10.2428 7.07102L6.35332 3.18157Z"
      fill="#3A434B"
    />
  </svg>
);

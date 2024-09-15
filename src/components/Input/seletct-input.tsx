import classNames from 'classnames';
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Multiselect from 'multiselect-react-dropdown';
import {
  IMultiSelect,
  IMultiSelectOptionItem,
  ISelectInput,
  ISelectInputOptionItem,
  ISelectOption,
} from '../types';
import { Spinner } from '../Spinner/Spinner.component';

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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLSpanElement>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [selected, setSelected] = useState<string | ISelectInputOptionItem>(
    props.selected || props.value || {},
  );
  const [search, setSearch] = useState('');
  const [inputId] = useState(
    `select-input-${Math.random().toString().substr(2, 5)}`,
  );
  const { onBlur, actualValue, onChange, loading } = props;

  const className = classNames('select-input', {
    'select-input--open': showOptions,
    'select-input--dirty': !!Object.keys(selected).length,
    'select-input--has-error': !!props.error,
    'select-input--drop-top': props.dropTop,
    'select-input--table-style': props.applyTableStyle,
  });
  const placeholderClassName = classNames({
    'select-input__placeholder':
      typeof selected == 'string' || !!Object.keys(selected).length,
    'select-input__placeholder--placeholding':
      !selected || !Object.keys(selected).length,
  });
  const selectedValue = (props.options as any[]).find(
    (o) =>
      (typeof o === 'string' ? o : o[props.actualValue || 'id']) ===
      (typeof selected === 'string'
        ? selected
        : selected[props.actualValue || 'id']),
  );

  const handleOptionClick = (option: string | ISelectInputOptionItem) => {
    setSelected(option);
    setShowOptions(false);
    triggerInputEvent('change', option);
  };

  const triggerInputEvent = useCallback(
    (eventName: string, selectedI?: string | ISelectInputOptionItem) => {
      const sel = selectedI || selected;
      if (inputRef.current) {
        inputRef.current.value =
          typeof sel === 'string'
            ? sel
            : (sel[actualValue || 'id'] as string) || '';
        const event = new Event(eventName);
        inputRef.current.dispatchEvent(event);
      }
    },
    [inputRef, selected, actualValue],
  );

  useEffect(() => {
    if (!showOptions) {
      triggerInputEvent('blur');
    }
  }, [showOptions, triggerInputEvent]);

  useEffect(() => {
    const element = selectRef.current;
    const inputElement = inputRef.current;

    const handleClickOutside = (event: MouseEvent) => {
      // @ts-ignore
      if (!event?.target?.closest(`#${element?.id}`)) {
        setShowOptions(false);
      }
    };
    const handleBlur = (event: any) => {
      if (onBlur) {
        onBlur(event);
      }
    };
    const handleChange = (event: any) => {
      if (onChange) {
        onChange(event);
      }
    };

    window.addEventListener('click', handleClickOutside);
    inputElement?.addEventListener('blur', handleBlur);
    inputElement?.addEventListener('change', handleChange);

    return () => {
      window.removeEventListener('click', handleClickOutside);
      inputElement?.removeEventListener('blur', handleBlur);
      inputElement?.removeEventListener('change', handleChange);
    };
  }, [selectRef, inputRef, onBlur, onChange]);

  return (
    <span ref={selectRef} className={className} id={inputId}>
      {props.label && <label>{props.label}</label>}
      <span
        style={props.selectorStyle}
        className="select-input__selector"
        onClick={() => {
          if (!loading) {
            setShowOptions(!showOptions);
            setTimeout(() => {
              searchInputRef.current?.focus();
            }, 100);
          }
        }}
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
            aria-expanded={showOptions}
            readOnly
            ref={inputRef}
          />
        </span>
        <span className={placeholderClassName}>
          {(selectedValue &&
            (typeof selectedValue === 'string'
              ? selectedValue
              : (selectedValue[props.displayValue || 'name'] as string))) ||
            props.placeholder ||
            'Select'}
        </span>
        {!loading && (
          <span className="select-input__svg">
            {props.customIcon || <SelectInputSVG />}
          </span>
        )}
        {loading && (
          <span className="select-input__svg">
            <Spinner color="--green" />
          </span>
        )}
      </span>
      {!!props.error && (
        <span className="select-input__error-message">{props.error}</span>
      )}
      <span
        role="listbox"
        id={`${inputId}_list`}
        className="select-input__options"
        ref={optionsRef}
        style={{
          position: 'fixed',
          width: selectRef.current?.getBoundingClientRect()?.width,
          left: selectRef.current?.getBoundingClientRect()?.x,
          top:
            (selectRef.current?.getBoundingClientRect()?.y || 0) +
            (selectRef.current?.getBoundingClientRect()?.y || 0) * 0.05,
        }}
      >
        {props.showSearch && (
          <div className="select-input__search-input">
            <input
              type="search"
              className="input-v2__input input-v2--focused__input"
              placeholder={
                typeof props.showSearch === 'string'
                  ? props.showSearch
                  : props.placeholder
              }
              onChange={(event) => setSearch(event.target.value)}
              ref={searchInputRef}
            />
          </div>
        )}

        <div>
          {props.options.map((_value, index) => {
            const name =
              typeof _value === 'string'
                ? _value
                : (_value[props.displayValue || 'name'] as string);

            if (
              search.length &&
              !name.toLowerCase().includes(search.toLowerCase())
            ) {
              return null;
            }

            return (
              <Option
                key={`${inputId}-${index}`}
                isSelected={
                  (typeof selected === 'string'
                    ? selected
                    : selected[props.actualValue || 'id']) ===
                  (typeof _value === 'string'
                    ? _value
                    : (_value[props.actualValue || 'id'] as string))
                }
                onClick={() => handleOptionClick(_value)}
              >
                {name}
              </Option>
            );
          })}
        </div>
      </span>
    </span>
  );
};

export const SelectInputSVG = () => (
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

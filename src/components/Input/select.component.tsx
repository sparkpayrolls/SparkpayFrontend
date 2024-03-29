import { Select as S } from 'antd';
import { SelectValue } from 'antd/lib/select';
import classNames from 'classnames';
import { PropsWithChildren, useState } from 'react';
import { Container } from '../Shared/container.component';
import { ISelect } from '../types';
import { Text } from '../Typography/Text';

export type ISelectProps<T> = PropsWithChildren<ISelect<T>>;

export function Select<T extends SelectValue>(props: ISelectProps<T>) {
  const [autocompleteDisabled, setAutocompleteDisabled] = useState(false);
  const [focused, setFocused] = useState(false);
  const {
    label,
    error,
    className,
    containerClassName,
    onFocus,
    style,
    ...selectProps
  } = props;
  let id: string | undefined;
  const selectClass = classNames('app-select', className, {
    [`has-error`]: !!error,
  });
  const containerClass = classNames(
    'app-select-container app-select',
    containerClassName,
    {
      'app-select-container--focused': focused,
    },
  );
  if (label) {
    id = label.toLowerCase().replace(/\s/gi, '_');
  }

  return (
    <Container className={containerClass} style={style}>
      {label && (
        <Text className="label text__label" element="label" htmlFor={id}>
          {label}
        </Text>
      )}
      <S
        id={id}
        {...selectProps}
        className={selectClass}
        onFocus={(e) => {
          if (!autocompleteDisabled) {
            const els = document.querySelectorAll(
              '.ant-select-selection-search-input',
            );
            Array.prototype.forEach.call(els, (el) => {
              el?.setAttribute('autocomplete', 'registration-select');
            });
            setAutocompleteDisabled(true);
          }
          setFocused(true);
          if (onFocus) {
            onFocus(e);
          }
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur && props.onBlur(e);
        }}
      />
      {error && (
        <Text className="input-v2--error__error text__text-sm text__danger">
          {error}
        </Text>
      )}
    </Container>
  );
}

Select.Option = S.Option;

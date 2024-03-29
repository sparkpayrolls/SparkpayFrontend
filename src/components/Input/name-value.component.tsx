/* eslint-disable no-unused-vars */
import classNames from 'classnames';
import { useEffect, useState, useCallback } from 'react';
import { Text } from '../Typography/Text';
import { InputV2 } from './Input.component';

interface INameValue {
  name: string;
  value: string | number;
}
interface INameValueInputGroup {
  helper?: string;
  items?: INameValue[];
  name?: string;
  onChange?(val: { target: { value: INameValue[]; name: string } }): any;
  transformValue?(val: string | number | readonly string[] | undefined): any;
  readonly?: boolean;
  label?: string;
  error?: string | string[] | Partial<INameValue>[];
  className?: string;
}

export const NameValueInputGroup = (props: INameValueInputGroup) => {
  const [items, setItems] = useState<INameValue[]>([]);
  const [currentItem, setCurrentItem] = useState<INameValue>({
    name: '',
    value: 0,
  });
  const { error, helper, name, onChange, readonly, label, className } = props;
  const containerClass = classNames('name-value-input-group', className, {
    'name-value-input-group--error': !!error,
  });

  const triggerChange = useCallback(
    (value: INameValue[]) => {
      if (onChange) {
        onChange({
          target: {
            name: name || '',
            value,
          },
        });
      }
      setItems(value);
    },
    [onChange, name],
  );

  const removeItem = (index: number) => {
    const newItems = (props.items || items).filter((_, i) => index !== i);
    triggerChange(newItems);
  };

  const updateItem = (index: number, key: string, value: string) => {
    const itemsCopy = [...(props.items || items)];
    if (!itemsCopy[index]) {
      setCurrentItem({ ...currentItem, [key]: value });
      return;
    }

    const newItems = itemsCopy.map((item, i) => {
      if (i === index) {
        (item as any)[key] = value;
      }
      return item;
    });
    triggerChange(newItems);
  };

  useEffect(() => {
    if (currentItem.name) {
      triggerChange([...(props.items || items), currentItem]);
      setCurrentItem({ name: '', value: 0 });
    }
  }, [currentItem, items, props.items, triggerChange]);

  const it = [...(props.items || items)];
  const addEmptyField = it.every((item) => item.name);
  if (addEmptyField && !readonly) {
    it.push(currentItem);
  }

  return (
    <div className={containerClass}>
      {!!label && (
        <Text
          className="name-value-input-group__label text__label"
          element="label"
        >
          {label}
        </Text>
      )}

      <div className="name-value-input-group__inputs">
        {it.map((item, i) => {
          if (!item.name && i !== it.length - 1) {
            removeItem(i);
            return null;
          }
          const canDelete = i !== it.length - 1 && !readonly;
          let errors: string | Partial<INameValue> | undefined;
          if (Array.isArray(error)) {
            errors = error[i];
          }

          return (
            <div key={i} className="name-value-input">
              <InputV2
                placeholder="Name"
                value={item.name}
                onChange={(e) => {
                  updateItem(i, 'name', e.target.value);
                }}
                readOnly={readonly}
                error={
                  !!errors &&
                  (typeof errors === 'string' ? errors : errors.name)
                }
              />
              <InputV2
                placeholder="Value"
                type="number"
                value={item.value}
                onChange={(e) => {
                  updateItem(i, 'value', e.target.value);
                }}
                transformValue={props.transformValue}
                readOnly={readonly}
                error={
                  !!errors && typeof errors !== 'string' && `${errors.value}`
                }
              />
              {canDelete && (
                <span role="button" onClick={() => removeItem(i)}>
                  <Text className="sr-only">remove salary breakdown item</Text>
                  <i className="fas fa-trash fa"></i>{' '}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {!!error && typeof error === 'string' && (
        <Text className="input-v2--error__error text__text-sm text__danger">
          {error}
        </Text>
      )}
      {!!helper && !error && (
        <Text className="input-v2__helper text__text-sm text__gray400">
          {helper}
        </Text>
      )}
    </div>
  );
};

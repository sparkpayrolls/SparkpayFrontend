/* eslint-disable no-unused-vars */
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Text } from '../Typography/Text';
import { InputV2 } from './Input.component';

interface INameValueInputGroup {
  error?: boolean | string;
  helper?: string;
  items?: { name: string; value: number | number }[];
  name?: string;
  onChange?(val: {
    target: { value: { name: string; value: string | number }[]; name: string };
  }): any;
  transformValue?(val: string | number | readonly string[] | undefined): any;
  readonly?: boolean;
  label?: string;
}

export const NameValueInputGroup = (props: INameValueInputGroup) => {
  const [items, setItems] = useState(props.items || []);
  const { error, helper, name, onChange, readonly, label } = props;
  const containerClass = classNames('name-value-input-group', {
    'name-value-input-group--error': !!error,
  });
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => index !== i));
  };
  const updateItem = (index: number, key: string, value: string) => {
    setItems(
      [...items].map((item, i) => {
        if (i === index) {
          (item as any)[key] = value;
        }
        return item;
      }),
    );
  };

  useEffect(() => {
    const validItems = items.filter((i) => !!i.name && !!i.value);
    const itemOne = validItems.map((i) => `${i.name}:${i.value}`) || [];

    props.items?.forEach((i) => {
      const index = itemOne.indexOf(`${i.name}:${i.value}`);
      if (index !== -1) itemOne.splice(index, 1);
    });

    if (onChange && validItems.length && itemOne.length) {
      onChange({
        target: {
          name: name || '',
          value: items.filter((i) => !!i.name && !!i.value),
        },
      });
    }
  }, [items, name, onChange, props.items]);

  // Add empty input
  const addEmptyField = items.every((item) => !!item.name && !!item.value);
  if (addEmptyField && !readonly) {
    setItems([...items, { name: '', value: '' as any }]);
    return null;
  }

  // Remove empty input that is not last item

  return (
    <div className={containerClass}>
      {!!label && (
        <Text
          className="name-value-input-group__label text__label"
          text={label}
          element="label"
        />
      )}

      <div className="name-value-input-group__inputs">
        {items.map((item, i) => {
          if (!item.name && !item.value && i !== items.length - 1) {
            removeItem(i);
            return null;
          }
          const canDelete = i !== items.length - 1 && !readonly;

          return (
            <div key={i} className="name-value-input">
              <InputV2
                placeholder="Name"
                value={item.name}
                onChange={(e) => {
                  updateItem(i, 'name', e.target.value);
                }}
                readOnly={readonly}
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
              />
              {canDelete && (
                <span role="button" onClick={() => removeItem(i)}>
                  <Text
                    className="sr-only"
                    text="remove salary breakdown item"
                  />{' '}
                  <i className="fas fa-trash fa"></i>{' '}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {!!error && typeof error === 'string' && (
        <Text
          className="input-v2--error__error text__sm text__danger"
          text={error}
        />
      )}
      {!!helper && !error && (
        <Text
          className="input-v2__helper text__sm text__gray400"
          text={helper}
        />
      )}
    </div>
  );
};

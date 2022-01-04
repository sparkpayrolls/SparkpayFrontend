import { Select as S } from 'antd';
import { SelectValue } from 'antd/lib/select';
import classNames from 'classnames';
import { PropsWithChildren } from 'react';
import { InputError } from '../Shared/input-error.component';
import { Label } from '../Shared/label.component';
import { ISelect } from '../types';

export function Select<T extends SelectValue>(
  props: PropsWithChildren<ISelect<T>>,
) {
  const { label, error, className, ...selectProps } = props;
  let id: string | undefined;
  const selectClass = classNames('app-select', className, {
    [`has-error`]: !!error,
  });
  if (label) {
    id = label.toLowerCase().replace(/\s/gi, '_');
  }

  return (
    <div className="app-select">
      <Label htmlFor={id}>{label}</Label>
      <S id={id} {...selectProps} className={selectClass} />
      <InputError>{error}</InputError>
    </div>
  );
}

Select.Option = S.Option;

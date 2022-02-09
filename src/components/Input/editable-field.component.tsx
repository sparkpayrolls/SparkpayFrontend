import classNames from 'classnames';
import { DetailedHTMLProps, InputHTMLAttributes, useState } from 'react';
import { InputError } from '../Shared/input-error.component';
import { Spinner } from '../Spinner/Spinner.component';
import { EditableSVG } from '../svg';

interface IEditableField {
  // eslint-disable-next-line no-unused-vars
  transformValue?(val: string | number | readonly string[] | undefined): any;
  error?: boolean | string;
  loading?: boolean;
}

export const EditableField = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > &
    IEditableField,
) => {
  const [focused, setFocused] = useState<boolean>(false);
  const { loading, error, transformValue, type, ...inputProps } = props;
  const inputClassname = classNames('employee-list__input-container__input', {
    'employee-list__input-container__input--has-error': !!error,
  });
  const isNumberInput = type === 'number';
  let typeInternal = type;
  let value = props.value;
  if (((isNumberInput && !focused) || !isNumberInput) && transformValue) {
    value = transformValue(value);
  }
  if (isNumberInput) {
    typeInternal = focused ? 'number' : 'text';
  }

  return (
    <div className="employee-list__input-container">
      <input
        {...inputProps}
        className={inputClassname}
        onFocus={(e) => {
          props.onFocus && props.onFocus(e);
          setFocused(true);
        }}
        onBlur={(e) => {
          props.onBlur && props.onBlur(e);
          setFocused(false);
        }}
        type={typeInternal}
        value={value}
      />
      {!loading ? (
        <span>
          <EditableSVG />
        </span>
      ) : (
        <span className="employee-list__input-container__loader">
          <Spinner size={20} color="--green" />
        </span>
      )}
      <div className="employee-list__input-container__error">
        <InputError>{error}</InputError>
      </div>
    </div>
  );
};

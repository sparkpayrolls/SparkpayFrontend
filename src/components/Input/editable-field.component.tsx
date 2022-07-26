import classNames from 'classnames';
import { DetailedHTMLProps, InputHTMLAttributes, useState } from 'react';
import { IF } from '../Misc/if.component';
import { InputError } from '../Shared/input-error.component';
import { Spinner } from '../Spinner/Spinner.component';
import { EditableSVG } from '../svg';
import { Text } from '../Typography/Text';

interface IEditableField {
  // eslint-disable-next-line no-unused-vars
  transformValue?(val: string | number | readonly string[] | undefined): any;
  error?: boolean | string;
  helper?: string;
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
  const { loading, error, helper, transformValue, type, ...inputProps } = props;
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
      <IF condition={error}>
        <div className="employee-list__input-container__error">
          <InputError>{error}</InputError>
        </div>
      </IF>
      <IF condition={!error && helper}>
        <div className="employee-list__input-container__error">
          <Text
            className="input-v2__helper text__text-sm text__gray400"
            element="span"
          >
            {helper}
          </Text>
        </div>
      </IF>
    </div>
  );
};

/* eslint-disable no-unused-vars */
import classNames from 'classnames';
import {
  ChangeEventHandler,
  CSSProperties,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useState,
} from 'react';
import { ChevronBack, DeleteBd } from '../svg';

interface InputProps {
  error?: boolean | string;
  helper?: string;
  loading?: boolean;
  hideValue?: boolean;
  transformValue?(val: string | number | readonly string[] | undefined): any;
}

export const OrgInput = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > &
    InputProps,
) => {
  const {
    className,
    error,
    // helper,
    // loading,

    type,

    transformValue,

    ...inputProps
  } = props;
  const [focused, setFocused] = useState<boolean>(false);

  const isNumberInput = type === 'number';
  let contentVisibleInputType = props.type === 'password' ? 'text' : props.type;
  if (isNumberInput) {
    contentVisibleInputType = focused ? 'number' : 'text';
  }
  let value = props.value;
  if (((isNumberInput && !focused) || !isNumberInput) && transformValue) {
    value = transformValue(value);
  }
  const inputClassname = classNames(
    'info__remittance__form__input',
    { 'info__remittance__form__input--focus': focused },
    className,
  );
  const contClassname = classNames('info__remittance__form__input-cont', {
    'info__remittance__form__input-cont--focus': focused,
    'info__remittance__form__input-cont--error': !!error,
  });
  return (
    <>
      <div>
        <div className={contClassname}>
          <input
            {...inputProps}
            className={inputClassname}
            type={contentVisibleInputType || 'text'}
            value={value}
            onBlur={(e) => {
              props.onBlur && props.onBlur(e);
              setFocused(false);
            }}
            onFocus={(e) => {
              props.onFocus && props.onFocus(e);
              setFocused(true);
            }}
          />
        </div>
        {!!error && typeof error === 'string' && <p>{error}</p>}
      </div>
    </>
  );
};

type BreakDown = {
  name: string;
  value: any;
};
export const Breakdown = (props: BreakDown) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);

  const toggle = () => {
    if (!edit) {
      setShow(true);
      setTimeout(() => setEdit(true));
    } else {
      setEdit(false);
      setTimeout(() => setShow(false), 200);
    }
  };
  return (
    <div className="info__right-cont__breakdown__box">
      <div className="info__right-cont__breakdown__cont">
        <p className="info__right-cont__breakdown__cont__big-text">
          {props.name}
        </p>
        <div className="info__right-cont__breakdown__cont__buttons">
          <span
            className={`info__right-cont__breakdown__cont__buttons-chevron ${
              edit ? 'show' : ''
            }`}
            onClick={toggle}
          >
            <ChevronBack />
          </span>
          <span>
            <DeleteBd />
          </span>
        </div>
      </div>
      {show && (
        <div
          className={`info__right-cont__breakdown__inputs ${
            edit ? 'drop' : 'leave'
          }`}
        >
          <div className="info__right-cont__breakdown__inputs__cont">
            <label htmlFor="name">Name</label>
            <div className="info__right-cont__breakdown__inputs__cont__input">
              <input defaultValue={props.name} type="text" id="name" />
            </div>
          </div>
          <div className="info__right-cont__breakdown__inputs__cont">
            <label htmlFor="name">Percentage %</label>
            <div className="info__right-cont__breakdown__inputs__cont__input">
              <input defaultValue={`${props.value}%`} type="text" id="name" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

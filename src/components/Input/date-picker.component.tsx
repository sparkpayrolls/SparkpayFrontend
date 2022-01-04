import { DatePicker as ADP } from 'antd';
import classNames from 'classnames';
import Image from 'next/image';
import { FocusEvent, useState } from 'react';
import calendar from '../../../public/svgs/Calendar.svg';
import { Spinner } from '../Spinner/Spinner.component';
import { IDatePicker } from '../types';

export const DatePicker = (props: IDatePicker) => {
  const {
    error,
    onBlur,
    label,
    disabled,
    loading,
    className,
    ...inputProps
  } = props;

  const [active, setActive] = useState(false);

  const datePickerClassName = classNames('date-picker', className, {
    'date-picker--active': active,
    'date-picker--error': !!error,
  });

  const handlerBlur = (event: FocusEvent<HTMLInputElement>) => {
    setActive(false);
    if (onBlur) {
      onBlur(event);
    }
  };

  return (
    <div className={datePickerClassName}>
      {!!label && <div className="date-picker__label">{label}</div>}

      <div className="date-picker__container">
        <span className="date-picker__calendar">
          {loading && <Spinner color="--green" />}
          {!loading && <Image src={calendar} alt="calendar-icon" />}
        </span>

        <ADP
          disabled={disabled || loading}
          onFocus={() => setActive(true)}
          onBlur={handlerBlur}
          {...inputProps}
          className="date-picker__input"
          format="DD/M/YYYY"
        />
      </div>

      {!!error && <p className="date-picker__error">{error}</p>}
    </div>
  );
};

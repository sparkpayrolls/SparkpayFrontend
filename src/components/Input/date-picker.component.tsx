import { DatePicker as ADP, DatePickerProps } from 'antd';
import Multi, {
  CalendarProps,
  DatePickerProps as DatePickerPropsMulti,
} from 'react-multi-date-picker';
import classNames from 'classnames';
import Image from 'next/image';
import { FocusEvent, useState } from 'react';
import calendar from '../../../public/svgs/Calendar.svg';
import { Spinner } from '../Spinner/Spinner.component';
import { IDatePicker } from '../types';
import { Text } from '../Typography/Text';
import { RangePickerProps } from 'antd/lib/date-picker';

export const DatePicker = (props: IDatePicker & DatePickerProps) => {
  const {
    error,
    onBlur,
    label,
    disabled,
    loading,
    className,
    helper,
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
        />
      </div>

      {!!error && <p className="date-picker__error">{error}</p>}
      {!!helper && !error && (
        <Text className="textarea__helper text__text-sm text__gray400">
          {helper}
        </Text>
      )}
    </div>
  );
};

type IMultiple = IDatePicker & {
  onBlur?(): any;
};

const Multiple = (props: IMultiple & CalendarProps & DatePickerPropsMulti) => {
  const {
    error,
    onBlur,
    label,
    disabled,
    loading,
    className,
    helper,
    ...inputProps
  } = props;

  const [active, setActive] = useState(false);

  const datePickerClassName = classNames('date-picker', className, {
    'date-picker--active': active,
    'date-picker--error': !!error,
  });

  const handlerBlur = () => {
    setActive(false);
    if (onBlur) {
      onBlur();
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

        <Multi
          disabled={disabled || loading}
          onOpen={() => setActive(true)}
          onClose={handlerBlur}
          {...inputProps}
          className="date-picker__input"
        />
      </div>

      {!!error && <p className="date-picker__error">{error}</p>}
      {!!helper && !error && (
        <Text className="textarea__helper text__text-sm text__gray400">
          {helper}
        </Text>
      )}
    </div>
  );
};

DatePicker.Multiple = Multiple;

const RangePicker = (props: IDatePicker & RangePickerProps) => {
  const {
    error,
    onBlur,
    label,
    disabled,
    loading,
    className,
    helper,
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

        <ADP.RangePicker
          disabled={disabled || loading}
          onFocus={() => setActive(true)}
          onBlur={handlerBlur}
          {...inputProps}
          className="date-picker__input"
        />
      </div>

      {!!error && <p className="date-picker__error">{error}</p>}
      {!!helper && !error && (
        <Text className="textarea__helper text__text-sm text__gray400">
          {helper}
        </Text>
      )}
    </div>
  );
};

DatePicker.RangePicker = RangePicker;

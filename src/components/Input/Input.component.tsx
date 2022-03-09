/* eslint-disable no-unused-vars */
import {
  ChangeEvent,
  ChangeEventHandler,
  CSSProperties,
  DetailedHTMLProps,
  FocusEvent,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  useEffect,
  useState,
} from 'react';

import { Spinner } from '../Spinner/Spinner.component';
import classNames from 'classnames';
import { Text } from '../Typography/Text';
import { Container } from '../Shared/container.component';
import { HidePasswordSVG, ShowPasswordSVG } from '../svg';
interface InputProps {
  /**
   * Input Placeholder contents
   */
  placeholder?: string;
  /**
   * input type 'text' | 'email' | 'password'
   */
  type: 'text' | 'email' | 'password' | 'tel' | 'number';
  /**
   * Input label content
   */
  label: string;

  /**
   * label htmlFor & input name
   */
  name: string;

  /**
   * custom class name
   */
  className?: string;

  /**
   * Input value (optional)
   */
  value?: string | number;

  /**
   * Input onChange function
   */
  onChange: ChangeEventHandler<HTMLInputElement>;

  /**
   * Input onBlur function when focus leaves input
   */
  onBlur?: {
    (e: FocusEvent<any>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };

  /**
   * boolean value when there is error in input
   */
  hasError?: boolean | '';

  /**
   * Input error message
   */
  error?: string;

  transformValue?: (val: string | number) => string;

  loading?: boolean;

  readOnly?: boolean;

  style?: CSSProperties;
}

/**
 * Input UI component for user interaction
 */
export const Input = ({
  label,
  type = 'text',
  name,
  value,
  className,
  hasError,
  error,
  loading,
  transformValue,
  onChange,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [valueInternal, setValueInternal] = useState<
    string | number | undefined
  >();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (transformValue) {
      event.target.value = transformValue(event.target.value);
    }
    onChange(event);
    setValueInternal(event.target.value);
  };

  useEffect(() => {
    setValueInternal(value);
    if (transformValue && value) {
      setValueInternal(transformValue(value));
    }
  }, [transformValue, value]);

  return (
    <>
      {type !== 'password' ? (
        <div className={['input-container', `${className}`].join(' ')}>
          <label htmlFor={name} className="input-label">
            {label}
          </label>
          <div className="input-container__input">
            <input
              type={type}
              className={['input', `${hasError ? 'input--error' : ''}`].join(
                ' ',
              )}
              name={name}
              value={valueInternal}
              onChange={handleChange}
              {...props}
            />
            {loading && (
              <div className="input-container__input__loader">
                <Spinner color="--green" />
              </div>
            )}
          </div>

          {hasError ? <span className="input-error">{error}</span> : null}
        </div>
      ) : (
        <div className={['input-container', `${className}`].join(' ')}>
          <label htmlFor={name} className="input-label">
            {label}
          </label>
          <div
            className={[
              'input-password-container',
              `${hasError ? 'input--error' : ''}`,
            ].join(' ')}
          >
            <input
              type={showPassword ? 'text' : 'password'}
              className="input"
              name={name}
              value={valueInternal}
              onChange={handleChange}
              {...props}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {!loading ? (
                // eslint-disable-next-line @next/next/no-img-element
                showPassword ? (
                  <ShowPasswordSVG />
                ) : (
                  <HidePasswordSVG />
                )
              ) : (
                <Spinner color="--green" />
              )}
            </button>
          </div>

          {hasError ? <span className="input-error">{error}</span> : null}
        </div>
      )}
    </>
  );
};

interface IInputV2 {
  label?: string;
  labelFor?: string;
  error?: boolean | string;
  helper?: string;
  loading?: boolean;
  hideValue?: boolean;
  showVisibilityToggle?: boolean;
  transformValue?(val: string | number | readonly string[] | undefined): any;
}

export const InputV2 = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > &
    IInputV2,
) => {
  const [focused, setFocused] = useState<boolean>(false);
  const [contentVisible, setContentVisible] = useState<boolean>(true);
  const {
    className,
    label,
    error,
    helper,
    loading,
    hideValue,
    showVisibilityToggle,
    type,
    labelFor,
    transformValue,
    ...inputProps
  } = props;
  const inputClassname = classNames(
    'input-v2__input',
    { 'input-v2--focused__input': focused, 'input-v2--error__input': !!error },
    className,
  );
  const labelClassname = classNames('input-v2__label text__label', {
    'input-v2--focused__label text__black': focused,
  });
  const containerClass = classNames('input-v2', {
    'input-v2--focused': focused,
    'input-v2--error': !!error,
  });
  const isNumberInput = type === 'number';
  let contentVisibleInputType = props.type === 'password' ? 'text' : props.type;
  if (isNumberInput) {
    contentVisibleInputType = focused ? 'number' : 'text';
  }
  let value = props.value;
  if (((isNumberInput && !focused) || !isNumberInput) && transformValue) {
    value = transformValue(value);
  }

  useEffect(() => {
    if (hideValue !== undefined) {
      setContentVisible(!hideValue);
    }
  }, [hideValue]);

  return (
    <Container className={containerClass}>
      {!!label && (
        <Text
          className={labelClassname}
          htmlFor={labelFor}
          text={label}
          element="label"
        />
      )}
      <Container className="input-v2__input-container">
        <input
          {...inputProps}
          className={inputClassname}
          onBlur={(e) => {
            props.onBlur && props.onBlur(e);
            setFocused(false);
          }}
          onFocus={(e) => {
            props.onFocus && props.onFocus(e);
            setFocused(true);
          }}
          type={contentVisible ? contentVisibleInputType : 'password'}
          value={value}
        />
        <Container className="input-v2__add-on">
          {loading && <Spinner color="--green" />}
          {showVisibilityToggle && !loading && (
            <span
              role="button"
              className="input-v2__add-on__button"
              onClick={() => setContentVisible(!contentVisible)}
            >
              <Text text="toggle visibility" className="sr-only" />
              {
                // eslint-disable-next-line @next/next/no-img-element
                contentVisible ? <ShowPasswordSVG /> : <HidePasswordSVG />
              }
            </span>
          )}
        </Container>
      </Container>
      {!!error && typeof error === 'string' && (
        <Text
          className="input-v2--error__error text__text-sm text__danger"
          text={error}
        />
      )}
      {!!helper && !error && (
        <Text
          className="input-v2__helper text__text-sm text__gray400"
          text={helper}
        />
      )}
    </Container>
  );
};

interface ITextArea {
  label?: string;
  labelFor?: string;
  error?: boolean | string;
  helper?: string;
}

export const TextArea = (
  props: DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > &
    ITextArea,
) => {
  const { className, label, error, helper, labelFor, ...textAreaProps } = props;
  const [focused, setFocused] = useState<boolean>(false);
  const textareaClassname = classNames(
    'textarea__textarea',
    {
      'textarea--focused__textarea': focused,
      'textarea--error__textarea': !!error,
    },
    className,
  );
  const labelClassname = classNames('text__label', {
    'textarea--focused__label text__black': focused,
  });
  const containerClass = classNames('textarea', {
    'textarea--focused': focused,
    'textarea--error': !!error,
  });

  return (
    <div className={containerClass}>
      {label && (
        <Text
          className={labelClassname}
          htmlFor={labelFor}
          text={label}
          element="label"
        />
      )}
      <textarea
        {...textAreaProps}
        onBlur={(e) => {
          props.onBlur && props.onBlur(e);
          setFocused(false);
        }}
        className={textareaClassname}
        onFocus={(e) => {
          props.onFocus && props.onFocus(e);
          setFocused(true);
        }}
      />
      {!!error && typeof error === 'string' && (
        <Text
          className="textarea--error__error text__text-sm text__danger"
          text={error}
        />
      )}
      {!!helper && !error && (
        <Text
          className="textarea__helper text__text-sm text__gray400"
          text={helper}
        />
      )}
    </div>
  );
};

import { Select } from '@/components/Input/select.component';
import { IF } from '@/components/Misc/if.component';
import { Spinner } from '@/components/Spinner/Spinner.component';
import { useState } from 'react';
import { useElementPosition } from './hooks';
import { IConcealedSelect, IConcealedInput } from './types';

export const ConcealedSelect = (props: IConcealedSelect) => {
  const { selectProps, error, helper, loading, ...divProps } = props;
  const [editable, setEditable] = useState(false);
  const { elementRef, position } = useElementPosition<HTMLDivElement>(editable);

  return (
    <>
      <div {...divProps} onClick={() => setEditable(true)} ref={elementRef}>
        {divProps.children}
        <IF condition={loading}>
          <span className="employee-list__input-container__loader">
            <Spinner size={20} color="--green" />
          </span>
        </IF>
        <IF condition={error}>
          <div
            style={{
              width: '100%',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              position: 'static',
            }}
            className="employee-list__input-container__error input-error"
            title={error}
          >
            {error}
          </div>
        </IF>
        <IF condition={!error && helper}>
          <div
            className="employee-list__input-container__error input-v2__helper text__text-sm text__gray400"
            style={{
              width: '100%',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              position: 'static',
            }}
            title={helper}
          >
            {helper}
          </div>
        </IF>
      </div>
      <IF condition={editable}>
        <Select
          {...selectProps}
          onBlur={() => setEditable(false)}
          style={{
            zIndex: 999,
            position: 'fixed',
            top: `${position.y}px`,
            left: `${position.x}px`,
            width: `${position.width}px`,
            background: 'rgb(247 249 251)',
            height: '64px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
          }}
          autoFocus
        />
      </IF>
    </>
  );
};

export const ConcealedInput = (props: IConcealedInput) => {
  const { inputProps, error, helper, loading, ...divProps } = props;
  const [editable, setEditable] = useState(false);
  const { elementRef, position } = useElementPosition<HTMLDivElement>(editable);

  return (
    <>
      <div {...divProps} onClick={() => setEditable(true)} ref={elementRef}>
        {divProps.children}
        <IF condition={loading}>
          <span className="employee-list__input-container__loader">
            <Spinner size={20} color="--green" />
          </span>
        </IF>
        <IF condition={error}>
          <div
            style={{
              width: '100%',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              position: 'static',
            }}
            className="employee-list__input-container__error input-error"
            title={error}
          >
            {error}
          </div>
        </IF>
        <IF condition={!error && helper}>
          <div
            className="employee-list__input-container__error input-v2__helper text__text-sm text__gray400"
            style={{
              width: '100%',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              position: 'static',
            }}
            title={helper}
          >
            {helper}
          </div>
        </IF>
      </div>
      <IF condition={editable}>
        <input
          {...inputProps}
          onBlur={() => setEditable(false)}
          style={{
            zIndex: 999,
            position: 'fixed',
            top: `${position.y}px`,
            left: `${position.x}px`,
            width: `${position.width}px`,
          }}
          autoFocus
        />
      </IF>
    </>
  );
};

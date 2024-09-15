import { ChangeEvent, MouseEventHandler, useState } from 'react';
import { ChevronBack, DeleteBd } from '../svg';

type BreakDown = {
  name: string;
  value: number;
  handler: (_v: Record<string, unknown>) => unknown;
  onDelete: MouseEventHandler<HTMLButtonElement>;
};
export const Breakdown = (props: BreakDown) => {
  const [edit, setEdit] = useState<boolean>(!props.name);
  const [show, setShow] = useState<boolean>(!props.name);

  const toggle = () => {
    if (props.name) {
      if (!edit) {
        setShow(true);
        setTimeout(() => setEdit(true));
      } else {
        setEdit(false);
        setTimeout(() => setShow(false), 200);
      }
    }
  };

  const handleChange = (name: string) => {
    return (ev: ChangeEvent<HTMLInputElement>) => {
      const value = Number(ev.target.value) || ev.target.value;
      props.handler({ ...props, [name]: value });
    };
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
          <button onClick={props.onDelete}>
            <DeleteBd />
          </button>
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
              <input
                onChange={handleChange('name')}
                value={props.name}
                type="text"
              />
            </div>
          </div>
          <div className="info__right-cont__breakdown__inputs__cont">
            <label htmlFor="name">Percentage %</label>
            <div className="info__right-cont__breakdown__inputs__cont__input">
              <input
                onChange={handleChange('value')}
                value={props.value}
                type="number"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

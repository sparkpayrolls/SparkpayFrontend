import { useState } from 'react';
import { ChevronBack, DeleteBd } from '../svg';

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

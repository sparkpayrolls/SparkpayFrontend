import { ReactNode, useState } from 'react';
import { InfoSVG } from '../svg';

function HelperInfo(props: { children: ReactNode }) {
  const [hint, setHint] = useState<boolean>();
  const [show, setShow] = useState<boolean>();
  const toggle = () => {
    if (!hint) {
      setShow(true);
      setTimeout(() => setHint(true));
    } else {
      setHint(false);
      setTimeout(() => setShow(false), 100);
    }
  };
  return (
    <div className="info">
      <span onMouseEnter={toggle} onMouseLeave={toggle}>
        <InfoSVG />
      </span>
      {show && (
        <div className={`info__helper ${hint ? 'show' : 'leave'}`}>
          <p>{props.children}</p>
        </div>
      )}
    </div>
  );
}

export default HelperInfo;

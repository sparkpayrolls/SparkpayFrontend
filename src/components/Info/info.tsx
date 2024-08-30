import { ReactNode, useState } from 'react';
import { Info } from '../svg';

function HelperInfo(props: { children: ReactNode }) {
  const [hint, setHint] = useState<boolean>();
  return (
    <div className="info">
      <span
        onMouseEnter={() => setHint(true)}
        onMouseLeave={() => setHint(false)}
      >
        <Info />
      </span>
      <p className={`info__helper ${hint ? 'show' : ''}`}>{props.children}</p>
    </div>
  );
}

export default HelperInfo;

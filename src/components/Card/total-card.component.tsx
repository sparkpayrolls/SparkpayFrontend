import Skeleton from 'react-loading-skeleton';
import { ITotalCard } from '../types';

import 'react-loading-skeleton/dist/skeleton.css';

export const TotalCard = (props: ITotalCard) => {

  return (
    <div className={`total-card total-card`}>
      <div className="total-card__content">
        <span className="total-card__title">
          {props.loading ? (
            <Skeleton width={100} borderRadius={4} count={1} />
          ) : (
            props.title
          )}
        </span>

        <span className="total-card__value">
          {props.loading ? (
            <Skeleton width={50} borderRadius={4} count={1} />
          ) : (
            props.value
          )}
        </span>
      </div>
    </div>
  );
};

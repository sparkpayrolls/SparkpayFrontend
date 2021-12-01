import Skeleton from 'react-loading-skeleton';
import { IDashboardCard } from '../types';

import 'react-loading-skeleton/dist/skeleton.css';

export const DashboardCard = (props: IDashboardCard) => {
  const { Icon } = props;

  return (
    <div className="stats">
      <div className="stats__summary">
        {props.loading ? (
          <Skeleton width={100} borderRadius={4} count={1} />
        ) : (
          <span className="stats__number">{props.value}</span>
        )}
        <Icon />
      </div>

      {props.loading ? (
        <Skeleton borderRadius={4} count={1} />
      ) : (
        <span className="stats__info">{props.title}</span>
      )}
    </div>
  );
};

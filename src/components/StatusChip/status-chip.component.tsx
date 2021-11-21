import classNames from 'classnames';
import { IStatusChip } from '../types';

export const StatusChip = (props: IStatusChip) => {
  const className = classNames('status-chip', {
    [`status-chip--${props.status}`]: !!props.status,
  });

  return (
    <span className={className}>
      <span className="status-chip__indicator"></span>{' '}
      <span className="status-chip__text">{props.status}</span>
    </span>
  );
};

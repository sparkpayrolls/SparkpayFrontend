import classNames from 'classnames';
import { IIdentity } from '../types';
import { StatusChip } from '../StatusChip/status-chip.component';

export const Identity = (props: IIdentity) => {
  const className = classNames('identity', props.className, {
    [`identity--${props.type}`]: !!props.type,
  });

  return (
    <span className={className}>
      {!!props?.image && (
        <span className="identity__image">
          {
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={props?.image}
              width={props?.imageWidth}
              height={props?.imageHeight}
              alt={props.name}
            />
          }
        </span>
      )}

      {props.initial && !props?.image && (
        <span className="identity__initial">{props.initial}</span>
      )}

      <span style={{ display: 'flex', flexDirection: 'column' }}>
        <span className="identity__name">{props.name}</span>

        {props.status && <StatusChip status={props.status} />}
      </span>
    </span>
  );
};

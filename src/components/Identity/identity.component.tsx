import classNames from 'classnames';
import { ImageLoader } from 'src/layouts/dashboard-layout/DashBoardLayout';
import { IIdentity } from '../types';

export const Identity = (props: IIdentity) => {
  const className = classNames('identity', {
    [`identity--${props.type}`]: !!props.type,
  });

  return (
    <span className={className}>
      {!!props?.image && (
        <span className="identity__image">
          <ImageLoader
            src={props?.image}
            width={props?.imageWidth || 30}
            height={props?.imageHeight || 30}
            alt={props.name}
          />
        </span>
      )}

      {props.initial && !props?.image && (
        <span className="identity__initial">{props.initial}</span>
      )}

      <span className="identity__name">{props.name}</span>
    </span>
  );
};

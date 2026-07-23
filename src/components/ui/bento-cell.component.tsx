import classNames from 'classnames';
import Link from 'next/link';
import { ReactNode } from 'react';

type BentoCellProps = {
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
  media?: ReactNode;
  // grid-area name, wired in the grid stylesheet
  area: string;
  className?: string;
};

/**
 * A single bento cell (guide §5). Glass treatment lives in the stylesheet;
 * every cell links somewhere real. Hover lift, no tilt.
 */
export const BentoCell = (props: BentoCellProps) => {
  const inner = (
    <>
      <h3 className="mkt-bento-cell__title">{props.title}</h3>
      <p className="mkt-bento-cell__body">{props.body}</p>
      {props.media && <div className="mkt-bento-cell__media">{props.media}</div>}
      {props.href && (
        <span className="mkt-bento-cell__link">
          {props.linkLabel ?? 'Learn more'} →
        </span>
      )}
    </>
  );

  const className = classNames('mkt-bento-cell', props.className);
  const style = { gridArea: props.area };

  if (props.href) {
    return (
      <Link href={props.href}>
        <a className={className} style={style}>
          {inner}
        </a>
      </Link>
    );
  }

  return (
    <div className={className} style={style}>
      {inner}
    </div>
  );
};

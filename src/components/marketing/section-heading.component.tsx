import classNames from 'classnames';
import { Eyebrow } from '../ui/eyebrow.component';

/** Eyebrow → headline → optional one-sentence support (guide §4 rhythm). */
export const SectionHeading = (props: {
  eyebrow: string;
  title: string;
  lead?: string;
  onInk?: boolean;
  center?: boolean;
  className?: string;
}) => (
  <div
    className={classNames(
      'mkt-head',
      { 'mkt-head--center': props.center },
      props.className,
    )}
  >
    <Eyebrow onInk={props.onInk}>{props.eyebrow}</Eyebrow>
    <h2 className="mkt-h2">{props.title}</h2>
    {props.lead && <p className="mkt-lead">{props.lead}</p>}
  </div>
);

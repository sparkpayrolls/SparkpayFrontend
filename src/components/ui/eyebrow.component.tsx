import classNames from 'classnames';

/**
 * Mono uppercase label above every section headline. Encodes the section's
 * job as information (guide §5).
 */
export const Eyebrow = (props: {
  children: string;
  onInk?: boolean;
  className?: string;
}) => (
  <span
    className={classNames(
      'mkt-eyebrow',
      { 'mkt-eyebrow--on-ink': props.onInk },
      props.className,
    )}
  >
    {props.children}
  </span>
);

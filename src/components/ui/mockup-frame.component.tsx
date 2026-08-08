import classNames from 'classnames';
import { PropsWithChildren } from 'react';

/**
 * Chrome-less panel wrapping every product visual (guide §9): 16px radius, 1px
 * border, one soft shadow, optional ≤4° perspective in the hero only.
 */
export const MockupFrame = (
  props: PropsWithChildren<{
    tilt?: boolean;
    onInk?: boolean;
    className?: string;
    label?: string;
  }>,
) => (
  <div
    className={classNames(
      'mkt-mockup',
      { 'mkt-mockup--tilt': props.tilt, 'mkt-mockup--on-ink': props.onInk },
      props.className,
    )}
    role="img"
    aria-label={props.label}
  >
    {props.children}
  </div>
);

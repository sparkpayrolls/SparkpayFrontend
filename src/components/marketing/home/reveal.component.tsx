import classNames from 'classnames';
import { PropsWithChildren } from 'react';
import { useRevealOnScroll } from 'src/helpers/hooks/use-reveal-on-scroll.hook';

/** Fade + 16px rise, once (guide §7). Opacity-only under reduced motion. */
export const Reveal = (
  props: PropsWithChildren<{ className?: string; delay?: number; as?: 'div' | 'li' }>,
) => {
  const { ref, revealed } = useRevealOnScroll<HTMLDivElement>();
  const Tag = props.as ?? 'div';

  return (
    <Tag
      ref={ref as never}
      className={classNames('mkt-reveal', { 'is-in': revealed }, props.className)}
      style={props.delay ? { transitionDelay: `${props.delay}ms` } : undefined}
    >
      {props.children}
    </Tag>
  );
};

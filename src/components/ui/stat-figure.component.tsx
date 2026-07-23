import classNames from 'classnames';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useRevealOnScroll } from 'src/helpers/hooks/use-reveal-on-scroll.hook';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

type StatFigureProps = {
  label: string;
  onInk?: boolean;
  // a numeric figure that counts up once on first view
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

/**
 * Mono figure + label. Counts up once on first view (guide §5); static under
 * reduced motion.
 */
export const StatFigure = (props: StatFigureProps) => {
  const { label, onInk, value, prefix = '', suffix = '', decimals = 0 } = props;
  const { ref, revealed } = useRevealOnScroll<HTMLDivElement>();
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(prefersReducedMotion());
  }, []);

  const animate = revealed && !reduce;

  return (
    <div ref={ref} className={classNames('mkt-stat', { 'mkt-stat--on-ink': onInk })}>
      <span className="mkt-stat__value">
        {animate ? (
          <CountUp
            end={value}
            duration={0.8}
            separator=","
            decimals={decimals}
            prefix={prefix}
            suffix={suffix}
          />
        ) : (
          `${prefix}${value.toLocaleString('en-NG', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}${suffix}`
        )}
      </span>
      <span className="mkt-stat__label">{label}</span>
    </div>
  );
};

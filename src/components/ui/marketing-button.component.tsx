import classNames from 'classnames';
import Link from 'next/link';
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

type BaseProps = {
  variant?: Variant;
  size?: 'md' | 'sm';
  onInk?: boolean;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
};

type AsLink = BaseProps & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof BaseProps
  >;
type AsButton = BaseProps & { href?: undefined } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    keyof BaseProps
  >;

type MarketingButtonProps = AsLink | AsButton;

const classesFor = (props: BaseProps) =>
  classNames(
    'mkt-btn',
    `mkt-btn--${props.variant ?? 'primary'}`,
    {
      'mkt-btn--sm': props.size === 'sm',
      'mkt-btn--on-ink': props.onInk,
    },
    props.className,
  );

const Inner = ({ children, arrow }: Pick<BaseProps, 'children' | 'arrow'>) => (
  <>
    {children}
    {arrow && (
      <span className="mkt-btn__arrow" aria-hidden="true">
        →
      </span>
    )}
  </>
);

/**
 * Marketing CTA. Renders an anchor when `href` is set (internal via next/link),
 * otherwise a button. One primary per section — enforced by usage, not code.
 */
export const MarketingButton = (props: MarketingButtonProps) => {
  const { variant, size, onInk, arrow, children, className, ...rest } = props;
  const cls = classesFor({ variant, size, onInk, className, children });

  if (props.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    const external = /^https?:|^mailto:/.test(href);

    if (external) {
      return (
        <a className={cls} href={href} {...anchorRest}>
          <Inner arrow={arrow}>{children}</Inner>
        </a>
      );
    }

    return (
      <Link href={href}>
        <a className={cls} {...anchorRest}>
          <Inner arrow={arrow}>{children}</Inner>
        </a>
      </Link>
    );
  }

  const { type = 'button', ...buttonRest } =
    rest as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    // eslint-disable-next-line react/button-has-type
    <button className={cls} type={type} {...buttonRest}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
};

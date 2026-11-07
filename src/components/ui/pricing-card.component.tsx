import classNames from 'classnames';
import { MarketingButton } from './marketing-button.component';

export type PricingTier = {
  name: string;
  // Who the tier is for, where a figure used to sit. Pricing is quoted, not
  // listed, so this slot carries a team size rather than an amount.
  audience: string;
  blurb: string;
  features: string[];
  cta: string;
  href: string;
  recommended?: boolean;
};

/** Tier card (guide §5). Recommended variant elevated, used once per page. */
export const PricingCard = (props: { tier: PricingTier }) => {
  const { tier } = props;

  return (
    <div
      className={classNames('mkt-price', {
        'mkt-price--rec': tier.recommended,
      })}
    >
      {tier.recommended && (
        <span className="mkt-price__badge">Most popular</span>
      )}
      <h3 className="mkt-price__name">{tier.name}</h3>
      <p className="mkt-price__audience">{tier.audience}</p>
      <p className="mkt-price__blurb">{tier.blurb}</p>
      <MarketingButton
        href={tier.href}
        variant={tier.recommended ? 'primary' : 'secondary'}
        className="mkt-price__cta"
      >
        {tier.cta}
      </MarketingButton>
      <ul className="mkt-price__features">
        {tier.features.map((f) => (
          <li key={f}>
            <span className="mkt-price__check" aria-hidden="true">
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
};

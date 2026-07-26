import { MarketingButton } from '../ui/marketing-button.component';

/**
 * Global CTA band, reused above the footer on every marketing page (guide §5).
 * Gradient mesh, centered, single primary CTA.
 */
export const FinalCtaBand = (props: {
  title?: string;
  sub?: string;
  cta?: string;
  href?: string;
}) => {
  const {
    title = 'Give your team back the three days payroll steals.',
    sub = 'Salaries, PAYE, and statutory remittances — handled correctly, every month.',
    cta = 'Run your first payroll free',
    href = '/book-a-demo',
  } = props;

  return (
    <section className="mkt-final" data-mkt-dark>
      <div className="mkt-final__mesh" aria-hidden="true" />
      <div className="mkt-container mkt-final__inner">
        <h2 className="mkt-final__title">{title}</h2>
        <p className="mkt-final__sub">{sub}</p>
        <MarketingButton href={href} onInk>
          {cta}
        </MarketingButton>
      </div>
    </section>
  );
};

import Link from 'next/link';

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Overview', href: '/product' },
      { label: 'PAYE per state', href: '/features/paye' },
      { label: 'Statutory remittances', href: '/features/remittances' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Security', href: '/security' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Sign in', href: '/login' },
      { label: 'Book a demo', href: '/book-a-demo' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Terms', href: '/legal/terms' },
    ],
  },
];

export const MarketingFooter = () => (
  <footer className="mkt-footer">
    <div className="mkt-container mkt-footer__inner">
      <div className="mkt-footer__brand-col">
        <span className="mkt-footer__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/svgs/logo-white.svg"
            alt="SparkPay"
            className="mkt-footer__logo"
          />
        </span>
        <p className="mkt-footer__tagline">
          Payroll, PAYE, and statutory remittances for Nigerian businesses.
        </p>
        {/* newsletter stub — wired to a real endpoint later */}
        <form
          className="mkt-footer__news"
          onSubmit={(e) => e.preventDefault()}
          aria-label="Newsletter signup"
        >
          <label htmlFor="mkt-news" className="mkt-footer__news-label">
            Payroll tips for Nigerian teams, occasionally.
          </label>
          <div className="mkt-footer__news-row">
            <input
              id="mkt-news"
              type="email"
              placeholder="you@company.com"
              className="mkt-footer__news-input"
            />
            <button type="submit" className="mkt-footer__news-btn">
              Subscribe
            </button>
          </div>
        </form>
      </div>

      <div className="mkt-footer__cols">
        {columns.map((col) => (
          <div className="mkt-footer__col" key={col.title}>
            <h4 className="mkt-footer__col-title">{col.title}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>
                    <a className="mkt-footer__link">{l.label}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <div className="mkt-container mkt-footer__base">
      <span>© {new Date().getFullYear()} SparkPay. All rights reserved.</span>
      <span className="mkt-footer__rc">
        SparkPay Technologies Ltd · RC 1234567
      </span>
    </div>
  </footer>
);

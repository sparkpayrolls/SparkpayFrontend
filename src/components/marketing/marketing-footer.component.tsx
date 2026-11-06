import Link from 'next/link';

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Product overview', href: '/product' },
      { label: 'Income tax by state', href: '/features/income-tax' },
      { label: 'Remittances', href: '/features/remittances' },
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
    title: 'Get started',
    links: [
      { label: 'Book a demo', href: '/book-a-demo' },
      { label: 'Sign in', href: '/login' },
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

// Computed once at module scope rather than per render, so a server render on
// 31 Dec and a client hydrate on 1 Jan cannot disagree (plan F-8).
const COPYRIGHT_YEAR = new Date().getFullYear();

export const MarketingFooter = () => (
  <footer className="mkt-footer">
    <div className="mkt-container mkt-footer__inner">
      <div className="mkt-footer__brand-col">
        <Link href="/">
          <a className="mkt-footer__brand" aria-label="SparkPay home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/svgs/logo-white.svg"
              alt=""
              className="mkt-footer__logo"
            />
          </a>
        </Link>
        <p className="mkt-footer__tagline">
          Payroll, income tax, and statutory remittances, handled properly.
        </p>
      </div>

      <nav className="mkt-footer__cols" aria-label="Footer">
        {columns.map((col) => (
          <div className="mkt-footer__col" key={col.title}>
            <p className="mkt-footer__col-title">{col.title}</p>
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
      </nav>
    </div>

    <div className="mkt-container mkt-footer__base">
      <span>© {COPYRIGHT_YEAR} SparkPay. All rights reserved.</span>
    </div>
  </footer>
);

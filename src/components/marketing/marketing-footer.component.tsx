import Link from 'next/link';
import { FormEvent, useRef, useState } from 'react';

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Product overview', href: '/product' },
      { label: 'PAYE per state', href: '/features/paye' },
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

// Deliberately stricter than the browser's type="email" check, which accepts
// "a@b". Nothing here is a security boundary — the real validation belongs on
// whatever endpoint this is wired to (plan Q-3).
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type NewsState = 'idle' | 'invalid' | 'submitted';

const MarketingNewsletter = () => {
  const [state, setState] = useState<NewsState>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = inputRef.current?.value.trim() ?? '';

    if (!EMAIL.test(value)) {
      setState('invalid');
      inputRef.current?.focus();
      return;
    }

    // TODO(plan Q-3): nothing persists this address yet. Before this ships to
    // production either POST it to a real list, or soften the confirmation
    // copy below — see the R-3 risk in plan.md. Do not log the address.
    setState('submitted');
  };

  if (state === 'submitted') {
    return (
      <div className="mkt-footer__news">
        <p className="mkt-footer__news-done" role="status">
          Thanks — we&rsquo;ll be in touch.
        </p>
      </div>
    );
  }

  return (
    <form
      className="mkt-footer__news"
      onSubmit={onSubmit}
      noValidate
      aria-label="Newsletter signup"
    >
      <label htmlFor="mkt-news" className="mkt-footer__news-label">
        Payroll tips for Nigerian teams, occasionally.
      </label>
      <div className="mkt-footer__news-row">
        <input
          ref={inputRef}
          id="mkt-news"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          className="mkt-footer__news-input"
          aria-invalid={state === 'invalid'}
          aria-describedby={state === 'invalid' ? 'mkt-news-error' : undefined}
          onChange={() => state === 'invalid' && setState('idle')}
        />
        <button type="submit" className="mkt-footer__news-btn">
          Subscribe
        </button>
      </div>
      {state === 'invalid' && (
        <p id="mkt-news-error" className="mkt-footer__news-error" role="alert">
          Enter a valid email address, like you@company.com.
        </p>
      )}
    </form>
  );
};

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
          Payroll, PAYE, and statutory remittances for Nigerian businesses.
        </p>
        <MarketingNewsletter />
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

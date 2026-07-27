import classNames from 'classnames';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { MarketingButton } from '../ui/marketing-button.component';

const featureLinks = [
  {
    href: '/features/paye',
    title: 'PAYE per state',
    desc: 'Correct tax bands and reliefs for every state.',
  },
  {
    href: '/features/remittances',
    title: 'Statutory remittances',
    desc: 'Pension, NHF, NSITF and ITF, filed on time.',
  },
];

const setTheme = (theme: 'light' | 'dark') => {
  try {
    document.documentElement.setAttribute('data-mkt-theme', theme);
    localStorage.setItem('mkt-theme', theme);
  } catch (e) {
    /* ignore */
  }
};

export const MarketingNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  // reflect the current theme (set pre-paint in _document) + react to toggles
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setIsDark(root.getAttribute('data-mkt-theme') === 'dark');
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ['data-mkt-theme'] });
    return () => mo.disconnect();
  }, []);

  // is a dark section currently behind the nav? getBoundingClientRect is
  // viewport-relative, so this is robust to any scroll container. Capture-phase
  // scroll catches scrolling from nested containers too.
  const evaluate = useCallback(() => {
    const band = 44; // nav band height to test against
    let dark = false;
    document.querySelectorAll('[data-mkt-dark]').forEach((el) => {
      const r = (el as HTMLElement).getBoundingClientRect();
      if (r.top <= band && r.bottom >= 0) dark = true;
    });
    setOnDark(dark);

    const top = document.querySelector('[data-mkt-top]');
    if (top) {
      setScrolled((top as HTMLElement).getBoundingClientRect().top <= -8);
    } else {
      setScrolled(window.scrollY > 8);
    }
  }, []);

  useEffect(() => {
    evaluate();
    window.addEventListener('scroll', evaluate, true); // capture
    window.addEventListener('resize', evaluate);
    return () => {
      window.removeEventListener('scroll', evaluate, true);
      window.removeEventListener('resize', evaluate);
    };
  }, [evaluate]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  // dark background behind the nav → light text + white logo
  const darkBg = isDark || onDark;
  const logoSrc = darkBg ? '/svgs/logo-white.svg' : '/svgs/logo.svg';

  return (
    <header
      className={classNames('mkt-nav', {
        'mkt-nav--scrolled': scrolled,
        'mkt-nav--on-dark': darkBg,
      })}
    >
      <div className="mkt-container mkt-nav__inner">
        <Link href="/">
          <a className="mkt-nav__brand" aria-label="SparkPay home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} alt="" className="mkt-nav__logo" />
          </a>
        </Link>

        <nav className="mkt-nav__links" aria-label="Primary">
          <Link href="/product">
            <a className="mkt-nav__link">Product</a>
          </Link>

          <div
            className="mkt-nav__has-menu"
            onMouseEnter={() => setFeaturesOpen(true)}
            onMouseLeave={() => setFeaturesOpen(false)}
          >
            <button
              type="button"
              className="mkt-nav__link mkt-nav__link--button"
              aria-expanded={featuresOpen}
              aria-haspopup="true"
              onClick={() => setFeaturesOpen((v) => !v)}
            >
              Features
              <span className="mkt-nav__caret" aria-hidden="true">
                ▾
              </span>
            </button>

            {featuresOpen && (
              <div className="mkt-nav__mega" role="menu">
                {featureLinks.map((f) => (
                  <Link href={f.href} key={f.href}>
                    <a className="mkt-nav__mega-item" role="menuitem">
                      <span className="mkt-nav__mega-title">{f.title}</span>
                      <span className="mkt-nav__mega-desc">{f.desc}</span>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/pricing">
            <a className="mkt-nav__link">Pricing</a>
          </Link>
          <Link href="/about">
            <a className="mkt-nav__link">About</a>
          </Link>
        </nav>

        <div className="mkt-nav__actions">
          <button
            type="button"
            className="mkt-nav__theme"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
          >
            {isDark ? '☀' : '☾'}
          </button>
          <Link href="/login">
            <a className="mkt-nav__signin">Sign in</a>
          </Link>
          <MarketingButton href="/book-a-demo" size="sm">
            Run your first payroll free
          </MarketingButton>
        </div>

        <button
          type="button"
          className="mkt-nav__burger"
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* mobile drawer */}
      <div
        className={classNames('mkt-drawer', { 'mkt-drawer--open': drawerOpen })}
      >
        <div
          className="mkt-drawer__scrim"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
        <div className="mkt-drawer__panel" role="dialog" aria-label="Menu">
          <div className="mkt-drawer__head">
            <MarketingButton
              href="/book-a-demo"
              size="sm"
              onClick={() => setDrawerOpen(false)}
            >
              Run your first payroll free
            </MarketingButton>
            <button
              type="button"
              className="mkt-drawer__close"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
            >
              ×
            </button>
          </div>

          <nav className="mkt-drawer__links" aria-label="Mobile">
            <Link href="/product">
              <a className="mkt-drawer__link" onClick={() => setDrawerOpen(false)}>
                Product
              </a>
            </Link>
            {featureLinks.map((f) => (
              <Link href={f.href} key={f.href}>
                <a
                  className="mkt-drawer__link"
                  onClick={() => setDrawerOpen(false)}
                >
                  {f.title}
                </a>
              </Link>
            ))}
            <Link href="/pricing">
              <a className="mkt-drawer__link" onClick={() => setDrawerOpen(false)}>
                Pricing
              </a>
            </Link>
            <Link href="/about">
              <a className="mkt-drawer__link" onClick={() => setDrawerOpen(false)}>
                About
              </a>
            </Link>
            <Link href="/login">
              <a className="mkt-drawer__link" onClick={() => setDrawerOpen(false)}>
                Sign in
              </a>
            </Link>
            <button
              type="button"
              className="mkt-drawer__link mkt-drawer__theme"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
            >
              {isDark ? 'Light theme' : 'Dark theme'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

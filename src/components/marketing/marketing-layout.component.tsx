import Head from 'next/head';
import { useRouter } from 'next/router';
import { PropsWithChildren, useEffect } from 'react';
import { MarketingFooter } from './marketing-footer.component';
import { MarketingNav } from './marketing-nav.component';

const SITE_URL = 'https://sparkpayhq.com';
const DEFAULT_OG =
  'https://res.cloudinary.com/djhmpr0bv/image/upload/v1658836812/Frame_34099_pyt6ha.png';

export type MarketingSeo = {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
};

// site-wide Organization structured data (guide §10)
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SparkPay',
  url: SITE_URL,
  description:
    'Payroll, income tax and statutory remittances for Nigerian businesses.',
  areaServed: 'NG',
};

/**
 * The app's global CSS sets `height: 100%` and `overflow-x: hidden` on both
 * html and body (src/styles/core/_overwrite.scss), which makes <body> the
 * scroll container instead of the document — `window.scrollY` is always 0.
 * Next resets scroll between routes by calling `window.scrollTo`, which is a
 * no-op against that container, so following a nav or footer link used to
 * leave you at whatever offset you were at on the previous page. Clicking
 * "Pricing" in the footer landed you on /pricing already scrolled past its
 * h1, looking at an identical footer — so the link appeared to do nothing.
 *
 * Reset the real scroller. `instant` matters because that same stylesheet
 * sets `scroll-behavior: smooth`, which would otherwise animate the jump.
 */
const resetScroll = () => {
  [document.body, document.documentElement].forEach((el) => {
    if (!el) return;
    // The global stylesheet sets `scroll-behavior: smooth`, which would
    // animate this jump on every navigation. Turn it off for the reset only.
    const previous = el.style.scrollBehavior;
    el.style.scrollBehavior = 'auto';
    el.scrollTop = 0;
    el.scrollLeft = 0;
    el.style.scrollBehavior = previous;
  });
  window.scrollTo(0, 0);
};

/**
 * A plain `popstate` listener is no good here: on a Back press Next fires
 * routeChangeStart -> beforeHistoryChange -> routeChangeComplete -> popstate,
 * so the flag would be read before it was ever set. `beforePopState` runs
 * before Next starts routing, which is early enough.
 *
 * The flag lives at module scope because this layout remounts on every
 * navigation, which would reset anything held in component scope.
 */
let navigatedViaHistory = false;

const consumeHistoryNavigation = () => {
  const was = navigatedViaHistory;
  navigatedViaHistory = false;
  return was;
};

/**
 * Shared shell for every marketing page. Unlike the app's DefaultLayout, this
 * renders its children on the server, so content is present for crawlers and
 * first paint (guide §10 SEO).
 */
export const MarketingLayout = (
  props: PropsWithChildren<{ seo: MarketingSeo }>,
) => {
  const { seo, children } = props;
  const canonical = `${SITE_URL}${seo.path ?? ''}`;
  const ogImage = seo.ogImage ?? DEFAULT_OG;
  const router = useRouter();

  // Only forward navigations go to the top; Back/Forward must keep the
  // browser's restored position.
  useEffect(() => {
    router.beforePopState(() => {
      navigatedViaHistory = true;
      return true;
    });
    const onRouteChange = () => {
      if (consumeHistoryNavigation()) return;
      resetScroll();
    };
    router.events.on('routeChangeComplete', onRouteChange);
    return () => {
      router.events.off('routeChangeComplete', onRouteChange);
    };
  }, [router]);

  return (
    <div className="mkt">
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={canonical} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="SparkPay" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={ogImage} />

        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </Head>

      <a href="#main" className="mkt-skip">
        Skip to content
      </a>

      {/* scroll sentinel for the nav (robust to any scroll container) */}
      <span data-mkt-top aria-hidden="true" />
      <MarketingNav />
      <main id="main">{children}</main>
      <MarketingFooter />
    </div>
  );
};

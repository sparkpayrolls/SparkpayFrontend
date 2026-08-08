import Head from 'next/head';
import { PropsWithChildren } from 'react';
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
    'Payroll, PAYE and statutory remittances for Nigerian businesses.',
  areaServed: 'NG',
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

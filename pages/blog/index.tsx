import { FinalCtaBand } from '@/components/marketing/final-cta.component';
import { MarketingLayout } from '@/components/marketing/marketing-layout.component';
import { PageHero } from '@/components/marketing/page-hero.component';
import { MockupPaye } from '@/components/marketing/mockups/product-mockups.component';
import { NextPage } from 'next';
import Link from 'next/link';

// Scaffold, ready for MDX/CMS. One full template article; the rest are queued.
const posts = [
  {
    slug: 'the-real-cost-of-manual-payroll',
    tag: 'Payroll',
    title: 'The real cost of running payroll by hand',
    excerpt:
      'What a spreadsheet and a banking app actually cost a Nigerian SME every month — in hours, errors, and penalties.',
    live: true,
  },
  {
    slug: '#',
    tag: 'Compliance',
    title: 'PAYE, explained for Nigerian employers',
    excerpt: 'How pay-as-you-earn works across states, and where teams get it wrong.',
    live: false,
  },
  {
    slug: '#',
    tag: 'Compliance',
    title: 'Never miss a pension or NHF deadline again',
    excerpt: 'A calendar of statutory remittance deadlines and how to automate them.',
    live: false,
  },
];

const BlogIndex: NextPage = () => (
  <MarketingLayout
    seo={{
      title: 'Blog — payroll and compliance for Nigerian businesses | SparkPay',
      description:
        'Practical writing on Nigerian payroll: PAYE, pension, NHF and statutory remittances, and how to run payroll without the monthly scramble.',
      path: '/blog',
    }}
  >
    <PageHero
      eyebrow="BLOG"
      title="Payroll, tax and compliance, in plain language."
      lead="Practical writing for Nigerian employers who’d rather spend their time on the business than the payroll."
      visual={<MockupPaye />}
      visualLabel="PAYE by state comparison"
    />

    <section className="mkt-section" style={{ paddingTop: '1rem' }}>
      <div className="mkt-container">
        <div className="mkt-cards">
          {posts.map((p) => {
            const card = (
              <>
                <div className="mkt-card__media">{p.tag}</div>
                <div className="mkt-card__body">
                  <span className="mkt-card__tag">{p.tag}</span>
                  <h2 className="mkt-card__title">{p.title}</h2>
                  <p className="mkt-card__excerpt">{p.excerpt}</p>
                  {!p.live && (
                    <span className="mkt-card__todo">Coming soon</span>
                  )}
                </div>
              </>
            );

            return p.live ? (
              <Link href={`/blog/${p.slug}`} key={p.title}>
                <a className="mkt-card">{card}</a>
              </Link>
            ) : (
              <div className="mkt-card" key={p.title}>
                {card}
              </div>
            );
          })}
        </div>
      </div>
    </section>

    <FinalCtaBand />
  </MarketingLayout>
);

export default BlogIndex;

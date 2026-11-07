import { FinalCtaBand } from '@/components/marketing/final-cta.component';
import { MarketingLayout } from '@/components/marketing/marketing-layout.component';
import { PageHero } from '@/components/marketing/page-hero.component';
import { SectionHeading } from '@/components/marketing/section-heading.component';
import { FaqAccordion } from '@/components/ui/faq-accordion.component';
import {
  PricingCard,
  PricingTier,
} from '@/components/ui/pricing-card.component';
import { NextPage } from 'next';
import Head from 'next/head';

const tiers: PricingTier[] = [
  {
    name: 'Starter',
    audience: 'Up to 5 employees',
    blurb: 'For small teams finding their feet. Run your first payroll free.',
    features: [
      'Salary disbursement',
      'Income tax calculation',
      'Payslips by email',
    ],
    cta: 'Book a demo',
    href: '/book-a-demo',
  },
  {
    name: 'Growth',
    audience: '5 to 100 employees',
    blurb: 'For growing businesses that run payroll every month.',
    features: [
      'Everything in Starter',
      'Unlimited employees',
      'Pension and statutory remittances',
      'Approval workflow',
      'Full audit trail',
    ],
    cta: 'Book a demo',
    href: '/book-a-demo',
    recommended: true,
  },
  {
    name: 'Scale',
    audience: '100+ employees, or several entities',
    blurb: 'For multi-entity groups with dedicated support needs.',
    features: [
      'Everything in Growth',
      'Multi-company management',
      'Priority support',
      'Custom onboarding',
    ],
    cta: 'Talk to us',
    href: '/contact',
  },
];

const comparison: { label: string; spark: boolean; manual: boolean }[] = [
  { label: 'Pay the whole team in one approval', spark: true, manual: false },
  { label: 'Income tax calculated automatically', spark: true, manual: false },
  { label: 'Statutory remittances filed on time', spark: true, manual: false },
  { label: 'Payslips sent automatically', spark: true, manual: false },
  { label: 'Exportable audit trail', spark: true, manual: false },
  { label: 'Hours of spreadsheet work each month', spark: false, manual: true },
];

const faq = [
  {
    q: 'How is pricing worked out?',
    a: 'Around the number of people you actually pay each month and the plan you need. People you do not pay in a given month are not counted. Book a demo and we will quote it.',
  },
  {
    q: 'Is my first payroll really free?',
    a: 'Yes. You can run your first payroll on the Starter plan without a card, so you can see the whole flow before committing to anything.',
  },
  {
    q: 'How does billing work?',
    a: 'Monthly, and tied to the people you actually pay that month rather than everyone on your books. Your quote sets the rate before you start.',
  },
  {
    q: 'Can I switch plans or leave?',
    a: 'You can move between plans at any time, and export your data whenever you like. There is no lock-in.',
  },
  {
    q: 'Is my payroll data secure?',
    a: 'Data is encrypted in transit and at rest, with role-based access for every administrator. See our security page for detail.',
  },
];

const PricingPage: NextPage = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <MarketingLayout
      seo={{
        title: 'Pricing — built around your team | SparkPay',
        description:
          'Pricing is quoted around the size of your team and what you need. Book a demo and we will put a number to it.',
        path: '/pricing',
      }}
    >
      <Head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </Head>

      <PageHero
        center
        eyebrow="PRICING"
        title="Pricing built around your team."
        lead="Tell us how many people you pay and what you need. We will quote it — no setup fees, no lock-in."
      />

      <section className="mkt-section" style={{ paddingTop: 0 }}>
        <div className="mkt-container">
          <div className="mkt-pricing-grid">
            {tiers.map((t) => (
              <PricingCard tier={t} key={t.name} />
            ))}
          </div>
        </div>
      </section>

      <section
        className="mkt-section"
        style={{ background: 'var(--bg-canvas)' }}
      >
        <div className="mkt-container">
          <SectionHeading
            eyebrow="VS THE OLD WAY"
            title="SparkPay against a spreadsheet and a banking app"
          />
          <div style={{ overflowX: 'auto' }}>
            <table className="mkt-compare">
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  <th>SparkPay</th>
                  <th>Manual</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td className="mkt-compare__spark">
                      {row.spark ? '✓' : '—'}
                    </td>
                    <td className="mkt-compare__miss">
                      {row.manual ? '✓' : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mkt-section">
        <div className="mkt-container">
          <SectionHeading
            center
            eyebrow="PRICING FAQ"
            title="Common questions"
          />
          <FaqAccordion items={faq} />
        </div>
      </section>

      <FinalCtaBand />
    </MarketingLayout>
  );
};

export default PricingPage;

import { FinalCtaBand } from '@/components/marketing/final-cta.component';
import { MarketingLayout } from '@/components/marketing/marketing-layout.component';
import { PageHero } from '@/components/marketing/page-hero.component';
import { MockupPayslip } from '@/components/marketing/mockups/showcase-mockups.component';
import { SectionHeading } from '@/components/marketing/section-heading.component';
import { FaqAccordion } from '@/components/ui/faq-accordion.component';
import { PricingCard, PricingTier } from '@/components/ui/pricing-card.component';
import { NextPage } from 'next';
import Head from 'next/head';

const tiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '₦0',
    unit: '/ month',
    blurb: 'Run your first payroll free. For small teams finding their feet.',
    features: [
      'Up to 5 employees',
      'Salary disbursement',
      'PAYE calculation',
      'Payslips by email',
    ],
    cta: 'Start free',
    href: '/create-account',
  },
  {
    name: 'Growth',
    price: '₦300',
    unit: '/ employee / month',
    blurb: 'For growing businesses that run payroll every month.',
    features: [
      'Unlimited employees',
      'PAYE per state',
      'Pension, NHF, NSITF, ITF remittances',
      'Approval workflow',
      'Full audit trail',
    ],
    cta: 'Run your first payroll free',
    href: '/create-account',
    recommended: true,
  },
  {
    name: 'Scale',
    price: 'Custom',
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
  { label: 'PAYE calculated per state', spark: true, manual: false },
  { label: 'Statutory remittances filed on time', spark: true, manual: false },
  { label: 'Payslips sent automatically', spark: true, manual: false },
  { label: 'Exportable audit trail', spark: true, manual: false },
  { label: 'Hours of spreadsheet work each month', spark: false, manual: true },
];

const faq = [
  {
    q: 'What counts as an employee?',
    a: 'Anyone you pay through SparkPay in a given month. People you do not pay that month are not billed.',
  },
  {
    q: 'Is my first payroll really free?',
    a: 'Yes. You can run your first payroll on the Starter plan without a card, so you can see the whole flow before paying anything.',
  },
  {
    q: 'How does billing work?',
    a: 'Growth is billed per employee paid, per month. You are only charged for the people you actually pay.',
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
        title: 'Pricing — pay for the people you pay | SparkPay',
        description:
          'Simple per-employee pricing for Nigerian payroll. Run your first payroll free, then pay only for the employees you actually pay each month.',
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
        eyebrow="PRICING"
        title="Pay for the people you pay."
        lead="Start free, then simple per-employee pricing — no setup fees, no lock-in."
        visual={<MockupPayslip />}
        visualLabel="SparkPay payslip summary"
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

      <section className="mkt-section" style={{ background: 'var(--bg-canvas)' }}>
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
                    <td className="mkt-compare__spark">{row.spark ? '✓' : '—'}</td>
                    <td className="mkt-compare__miss">{row.manual ? '✓' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mkt-section">
        <div className="mkt-container">
          <SectionHeading center eyebrow="PRICING FAQ" title="Common questions" />
          <FaqAccordion items={faq} />
        </div>
      </section>

      <FinalCtaBand />
    </MarketingLayout>
  );
};

export default PricingPage;

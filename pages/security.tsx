import { FinalCtaBand } from '@/components/marketing/final-cta.component';
import { MarketingLayout } from '@/components/marketing/marketing-layout.component';
import { PageHero } from '@/components/marketing/page-hero.component';
import { MockupAudit } from '@/components/marketing/mockups/product-mockups.component';
import { SectionHeading } from '@/components/marketing/section-heading.component';
import { NextPage } from 'next';

const measures = [
  {
    title: 'Encryption in transit and at rest',
    body: 'Payroll data is encrypted on the wire and in storage, so salary figures and bank details are never exposed in plain text.',
  },
  {
    title: 'Role-based access control',
    body: 'Every administrator gets a role with explicit permissions. Owners bypass nothing by accident; viewers cannot move money.',
  },
  {
    title: 'Full audit trail',
    body: 'Every action — a payroll run, an approval, a role change — is logged with who and when, and can be exported.',
  },
  {
    title: 'NDPR posture',
    body: 'We handle personal data in line with the Nigeria Data Protection Regulation.',
  },
  {
    title: 'Segregated approvals',
    body: 'Payroll can require a separate approver before funds move, so no single person both creates and pays a run.',
  },
  {
    title: 'Reliable disbursement',
    body: 'Runs pause automatically on insufficient funds and notify admins, so a team is never left half-paid.',
  },
];

const SecurityPage: NextPage = () => (
  <MarketingLayout
    seo={{
      title: 'Security — how SparkPay protects your payroll data',
      description:
        'How SparkPay protects Nigerian payroll data: encryption in transit and at rest, role-based access, a full audit trail, and NDPR-aware data handling.',
      path: '/security',
    }}
  >
    <PageHero
      eyebrow="SECURITY & TRUST"
      title="Payroll is sensitive. We treat it that way."
      lead="Salaries, bank details and tax records deserve real protection. Here is how SparkPay keeps your payroll data safe."
      visual={<MockupAudit />}
      visualLabel="SparkPay audit trail showing logged actions"
    />

    <section className="mkt-section">
      <div className="mkt-container">
        <SectionHeading
          eyebrow="HOW WE PROTECT YOU"
          title="The controls behind every payroll run"
        />
        <div className="mkt-cards" style={{ marginTop: '2.5rem' }}>
          {measures.map((m) => (
            <div className="mkt-card" key={m.title}>
              <div className="mkt-card__body">
                <h3 className="mkt-card__title">{m.title}</h3>
                <p className="mkt-card__excerpt">{m.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <FinalCtaBand
      title="Serious payroll, seriously protected."
      sub="Run your first payroll free and see the controls for yourself."
    />
  </MarketingLayout>
);

export default SecurityPage;

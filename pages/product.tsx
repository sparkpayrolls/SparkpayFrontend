import { MockupDashboard } from '@/components/marketing/mockup-dashboard.component';
import { FinalCtaBand } from '@/components/marketing/final-cta.component';
import { MarketingLayout } from '@/components/marketing/marketing-layout.component';
import {
  MockupAudit,
  MockupOrgs,
  MockupRemittance,
} from '@/components/marketing/mockups/product-mockups.component';
import { MockupFrame } from '@/components/ui/mockup-frame.component';
import { PageHero } from '@/components/marketing/page-hero.component';
import { NextPage } from 'next';
import { ReactNode } from 'react';

const stages: {
  step: string;
  title: string;
  body: string;
  points: string[];
  visual: ReactNode;
  flip?: boolean;
}[] = [
  {
    step: 'Stage 01 · Set up',
    title: 'Bring your team in once',
    body: 'Import employees and salaries from a spreadsheet, or add them by hand. Salary structures, allowances and deductions live in one place and stay in sync.',
    points: ['CSV or manual entry', 'Per-employee salary breakdown', 'Multiple companies from one login'],
    visual: <MockupOrgs />,
  },
  {
    step: 'Stage 02 · Run',
    title: 'One payroll run, every number shown',
    body: 'SparkPay computes net pay, PAYE, pension, NHF and NSITF for the whole team. You see the full breakdown before anything moves.',
    points: ['Net-to-gross or gross-to-net', 'Bonuses and deductions per cycle', 'Live totals as you review'],
    visual: <MockupDashboard />,
    flip: true,
  },
  {
    step: 'Stage 03 · Approve & disburse',
    title: 'Approve once, pay everyone',
    body: 'A single approval sends every salary straight to employee bank accounts. Insufficient funds pause the run and notify you — no half-paid teams.',
    points: ['Bulk bank transfers', 'Approval workflow for admins', 'Auto-pause on low balance'],
    visual: <MockupRemittance />,
  },
  {
    step: 'Stage 04 · Remit & record',
    title: 'Remittances filed, payslips sent, everything logged',
    body: 'Statutory deductions are remitted to the right authorities, payslips reach every employee by email, and every action lands in the audit trail.',
    points: ['PAYE, pension, NHF, NSITF', 'Automatic payslips', 'Exportable audit trail'],
    visual: <MockupAudit />,
    flip: true,
  },
];

const ProductPage: NextPage = () => (
  <MarketingLayout
    seo={{
      title: 'Product — one payroll cycle, start to finish | SparkPay',
      description:
        'See how SparkPay runs a full Nigerian payroll cycle: set up your team, run payroll, approve and disburse salaries, then remit PAYE, pension, NHF and NSITF.',
      path: '/product',
    }}
  >
    <PageHero
      eyebrow="THE PRODUCT"
      title="One payroll cycle, from spreadsheet to remitted."
      lead="Everything between “it’s payday” and “it’s handled” — set up, run, approve, disburse, remit, record."
      visual={<MockupDashboard />}
      visualLabel="SparkPay dashboard showing a payroll run of ₦125,000,000"
    />

    <section className="mkt-section">
      <div className="mkt-container">
        {stages.map((s, i) => (
          <div
            className={`mkt-split${s.flip ? ' mkt-split--flip' : ''}`}
            key={s.title}
            style={i > 0 ? { marginTop: '4.5rem' } : undefined}
          >
            <div className="mkt-split__copy">
              <span className="mkt-split__step">{s.step}</span>
              <h2 className="mkt-split__title">{s.title}</h2>
              <p className="mkt-split__body">{s.body}</p>
              <ul className="mkt-split__list">
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div className="mkt-split__visual">
              <MockupFrame className="mkt-visual-tilt">{s.visual}</MockupFrame>
            </div>
          </div>
        ))}
      </div>
    </section>

    <FinalCtaBand />
  </MarketingLayout>
);

export default ProductPage;

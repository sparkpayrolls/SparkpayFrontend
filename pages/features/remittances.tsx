import { FeatureLander } from '@/components/marketing/feature-lander.component';
import { MockupRemittance } from '@/components/marketing/mockups/product-mockups.component';
import { NextPage } from 'next';

const RemittancesPage: NextPage = () => (
  <FeatureLander
    seo={{
      title: 'Statutory remittances: pension, housing, compensation | SparkPay',
      description:
        'SparkPay calculates and files statutory remittances — pension, the housing fund, employee compensation and the training levy — on schedule, so you never miss a deadline or a penalty.',
      path: '/features/remittances',
    }}
    eyebrow="REMITTANCES, HANDLED"
    h1="Every statutory contribution, filed before the deadline."
    lead="Every statutory deduction is calculated on each payslip and remitted to the right authority on schedule, with a record you can hand to any auditor."
    heroVisual={<MockupRemittance />}
    beats={[
      {
        title: 'Calculated per payslip',
        body: 'Employee and employer pension, the housing fund, employee compensation and the training levy are computed from each salary breakdown, every run.',
      },
      {
        title: 'Routed to the right body',
        body: 'Each contribution reaches its own authority — the pension administrator, the housing fund, and the agencies behind the rest. No manual portals.',
      },
      {
        title: 'Filed on schedule',
        body: 'Deadlines are tracked and remittances scheduled ahead of them, so penalty letters stop arriving.',
      },
    ]}
    example={{
      heading: 'One run, every statutory line settled',
      lead: 'For an 850,000 gross, SparkPay computes and schedules each remittance to the correct authority.',
      rows: [
        { label: 'Pension (8% employee)', value: '68,000' },
        { label: 'Pension (10% employer)', value: '85,000' },
        { label: 'Housing fund (2.5%)', value: '21,250' },
        { label: 'Total remitted this line', value: '174,250', accent: true },
      ],
      visual: <MockupRemittance />,
    }}
    faq={[
      {
        q: 'Which statutory deductions does SparkPay cover?',
        a: 'Pension (employee and employer), the housing fund, employee compensation and the training levy. Each is computed from the salary breakdown and remitted to the appropriate authority.',
      },
      {
        q: 'What is the housing fund remittance deadline?',
        a: 'Housing fund contributions are generally remitted monthly to the national mortgage bank. SparkPay schedules the remittance ahead of the due date.',
      },
      {
        q: 'Can I choose the pension fund administrator?',
        a: "Yes. Each employee's pension administrator is stored, and their contribution is routed accordingly.",
      },
      {
        q: 'Do I get proof of remittance?',
        a: 'Every remittance is recorded in your audit trail and can be exported, so you always have evidence for an audit.',
      },
    ]}
  />
);

export default RemittancesPage;

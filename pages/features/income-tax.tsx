import { FeatureLander } from '@/components/marketing/feature-lander.component';
import { MockupPaye } from '@/components/marketing/mockups/product-mockups.component';
import { NextPage } from 'next';

const PayePage: NextPage = () => (
  <FeatureLander
    seo={{
      title: 'Income tax calculation by state | SparkPay',
      description:
        'Income tax differs by state. SparkPay applies the right bands and reliefs for every employee and remits to the correct state tax authority — automatically.',
      path: '/features/income-tax',
    }}
    eyebrow="INCOME TAX, DONE RIGHT"
    h1="Tax rates differ by state. Get every figure right."
    lead="SparkPay applies the correct bands and reliefs for each employee's tax state and remits to the right authority — Lagos, Oyo, Rivers, FCT and beyond."
    heroVisual={<MockupPaye />}
    beats={[
      {
        title: 'We use the right state',
        body: 'Each employee is taxed under the correct state internal revenue service, not a national guess.',
      },
      {
        title: 'We apply the bands',
        body: 'Consolidated relief and the graduated tax bands are computed per payslip, every run.',
      },
      {
        title: 'We remit on time',
        body: 'The right amount reaches the right state tax authority before the deadline, with a record you can export.',
      },
    ]}
    example={{
      heading: 'Same salary, different state, different tax',
      lead: 'An 850,000 monthly gross produces a different tax figure depending on the state — SparkPay handles the difference for you.',
      rows: [
        { label: 'Monthly gross', value: '850,000' },
        { label: 'Lagos', value: '184,500' },
        { label: 'Oyo', value: '171,200' },
        { label: 'Net to employee (Lagos)', value: '665,500', accent: true },
      ],
      visual: <MockupPaye />,
    }}
    faq={[
      {
        q: 'How does SparkPay know which state to remit to?',
        a: "Each employee's tax state is set on their profile. SparkPay applies that state's tax bands and remits to the correct state tax authority.",
      },
      {
        q: 'Does SparkPay handle consolidated relief allowance?',
        a: 'Yes. The consolidated relief allowance and the graduated tax bands are applied on every payslip, so the figure reflects current tax rules.',
      },
      {
        q: 'What about pension and other reliefs before tax?',
        a: 'Statutory deductions like pension and the housing fund reduce taxable income before tax is computed. SparkPay accounts for them in the same run.',
      },
      {
        q: 'When is income tax due?',
        a: 'Income tax is generally remitted by the 10th of the following month. SparkPay schedules remittances ahead of the deadline so you do not miss it.',
      },
    ]}
  />
);

export default PayePage;

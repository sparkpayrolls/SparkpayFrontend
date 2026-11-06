import { FeatureLander } from '@/components/marketing/feature-lander.component';
import { MockupPaye } from '@/components/marketing/mockups/product-mockups.component';
import { NextPage } from 'next';

const PayePage: NextPage = () => (
  <FeatureLander
    seo={{
      title: 'Income tax, calculated on every payslip | SparkPay',
      description:
        'SparkPay applies the right bands and reliefs for every employee, computes the tax on every payslip and remits it to the authority — automatically.',
      path: '/features/income-tax',
    }}
    eyebrow="INCOME TAX, DONE RIGHT"
    h1="Income tax, right on every payslip."
    lead="SparkPay applies the correct bands and reliefs for every employee, then remits the tax to the authority before the deadline."
    heroVisual={<MockupPaye />}
    beats={[
      {
        title: 'We use the right details',
        body: 'Each employee is taxed on their own figures, from their own payslip — not an estimate across the team.',
      },
      {
        title: 'We apply the bands',
        body: 'Consolidated relief and the graduated tax bands are computed per payslip, every run.',
      },
      {
        title: 'We remit on time',
        body: 'The right amount reaches the tax authority before the deadline, with a record you can export.',
      },
    ]}
    example={{
      heading: 'One salary, every number accounted for',
      lead: 'Relief and statutory deductions come off before tax is computed. SparkPay works the whole chain out on every payslip, every run.',
      rows: [
        { label: 'Monthly gross', value: '850,000' },
        { label: 'Relief and statutory deductions', value: '85,000' },
        { label: 'Income tax', value: '184,500' },
        { label: 'Net to employee', value: '665,500', accent: true },
      ],
      visual: <MockupPaye />,
    }}
    faq={[
      {
        q: 'How does SparkPay know what to remit?',
        a: "Each employee's tax details sit on their profile. SparkPay applies the right bands and reliefs and remits to the tax authority on schedule.",
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

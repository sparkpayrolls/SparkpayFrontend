import { MarketingLayout } from '@/components/marketing/marketing-layout.component';
import { NextPage } from 'next';

const PrivacyPage: NextPage = () => (
  <MarketingLayout
    seo={{
      title: 'Privacy Policy | SparkPay',
      description:
        'How SparkPay collects, uses and protects personal and payroll data for Nigerian businesses.',
      path: '/legal/privacy',
    }}
  >
    <div className="mkt-legal">
      <h1>Privacy Policy</h1>
      <p className="mkt-legal__updated">Last updated: 18 July 2026</p>

      <p>
        This policy explains how SparkPay handles the personal and payroll data
        you entrust to us.
      </p>

      <h2>1. Information we collect</h2>
      <p>
        We collect the information needed to run payroll: company details,
        employee records, salary and bank information, and usage data from the
        product.
      </p>

      <h2>2. How we use it</h2>
      <p>
        Data is used to calculate salaries and PAYE, disburse payments, remit
        statutory deductions, and provide support. We do not sell your data.
      </p>

      <h2>3. Data protection (NDPR)</h2>
      <p>
        We handle personal data in line with the Nigeria Data Protection
        Regulation.
      </p>

      <h2>4. Your rights</h2>
      <p>
        You can request access to, correction of, or deletion of your data by
        contacting us, and we will respond within a reasonable period.
      </p>

      <h2>5. Contact</h2>
      <p>
        Questions about this policy can be sent to{' '}
        <a href="mailto:support@sparkpayhq.com">support@sparkpayhq.com</a>.
      </p>
    </div>
  </MarketingLayout>
);

export default PrivacyPage;

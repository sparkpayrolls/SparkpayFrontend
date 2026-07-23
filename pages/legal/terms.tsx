import { MarketingLayout } from '@/components/marketing/marketing-layout.component';
import { NextPage } from 'next';

const TermsPage: NextPage = () => (
  <MarketingLayout
    seo={{
      title: 'Terms of Service | SparkPay',
      description:
        'The terms governing use of SparkPay payroll services for Nigerian businesses.',
      path: '/legal/terms',
    }}
  >
    <div className="mkt-legal">
      <h1>Terms of Service</h1>
      <p className="mkt-legal__updated">Last updated: 18 July 2026</p>

      <p>These terms govern your use of SparkPay.</p>

      <h2>1. Using SparkPay</h2>
      <p>
        You agree to use SparkPay to run payroll lawfully and to provide
        accurate employee and salary information.
      </p>

      <h2>2. Fees and billing</h2>
      <p>
        Fees are described on our pricing page and billed as set out there.
      </p>

      <h2>3. Payments and remittances</h2>
      <p>
        You are responsible for funding payroll runs. SparkPay facilitates
        disbursement and statutory remittances based on the data you provide.
      </p>

      <h2>4. Termination</h2>
      <p>You may stop using SparkPay at any time and export your data.</p>

      <h2>5. Contact</h2>
      <p>
        Questions about these terms can be sent to{' '}
        <a href="mailto:support@sparkpayhq.com">support@sparkpayhq.com</a>.
      </p>
    </div>
  </MarketingLayout>
);

export default TermsPage;

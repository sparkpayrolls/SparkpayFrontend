import { FinalCtaBand } from '@/components/marketing/final-cta.component';
import { MarketingLayout } from '@/components/marketing/marketing-layout.component';
import { NextPage } from 'next';

// Template article demonstrating the reading experience (680px measure, 18px
// body, mono pull-stats).
const Article: NextPage = () => (
  <MarketingLayout
    seo={{
      title: 'The real cost of running payroll by hand | SparkPay',
      description:
        'What a spreadsheet and a banking app actually cost a Nigerian SME every month — in hours, errors and penalties — and what changes when payroll is automated.',
      path: '/blog/the-real-cost-of-manual-payroll',
    }}
  >
    <article className="mkt-article">
      <span className="mkt-article__meta mkt-figure">
        Payroll · 6 min read · 18 July 2026
      </span>
      <h1 className="mkt-article__title">
        The real cost of running payroll by hand
      </h1>

      <div className="mkt-article__body">
        <p>
          Ask any Nigerian business owner what payday feels like and you&rsquo;ll
          hear the same story: a spreadsheet opened days in advance, salaries
          typed row by row, and a banking app used to send transfers one at a
          time. It works, until it doesn&rsquo;t.
        </p>

        <div className="mkt-article__pull">
          A team of 30 loses roughly{' '}
          <span className="mkt-figure">2 days</span> a month to manual payroll —
          before a single error.
        </div>

        <h2>The hidden line items</h2>
        <p>
          The obvious cost is time. The hidden costs are worse: a PAYE figure
          calculated with the wrong state&rsquo;s rates, a pension remittance
          that slips past its deadline, a transfer sent to a stale account
          number. Each one carries a real price — a penalty letter, an
          underpaid employee, an afternoon spent reconciling.
        </p>

        <h2>What changes with automation</h2>
        <p>
          When the calculation, the disbursement and the remittance happen in a
          single reviewed run, the error surface collapses. PAYE is applied per
          state automatically. Pension, NHF and NSITF are filed on schedule.
          Every action lands in an audit trail. Payday stops being a project.
        </p>

        <p>
          The spreadsheet got you here. It won&rsquo;t get you to fifty
          employees.
        </p>
      </div>
    </article>

    <FinalCtaBand />
  </MarketingLayout>
);

export default Article;

import { FinalCtaBand } from '@/components/marketing/final-cta.component';
import { MarketingLayout } from '@/components/marketing/marketing-layout.component';
import { MockupDashboard } from '@/components/marketing/mockup-dashboard.component';
import { PageHero } from '@/components/marketing/page-hero.component';
import { SectionHeading } from '@/components/marketing/section-heading.component';
import { NextPage } from 'next';

const timeline = [
  {
    year: '2021',
    title: 'Where it started',
    body: 'SparkPay started with a simple frustration: paying a small team in Nigeria meant a spreadsheet, a banking app, and a lot of praying.',
  },
  {
    year: '2022',
    title: 'PAYE, done properly',
    body: 'We built PAYE that respects the reality that tax differs by state — the thing generic tools get wrong.',
  },
  {
    year: '2023',
    title: 'Statutory remittances',
    body: 'Pension, NHF, NSITF and ITF joined the run, so compliance stopped being a monthly scramble.',
  },
  {
    year: 'Today',
    title: 'One run, every month',
    body: 'Nigerian businesses run their whole payroll — salaries, tax, remittances — in minutes, not days.',
  },
];

const AboutPage: NextPage = () => (
  <MarketingLayout
    seo={{
      title: 'About — why Nigerian payroll deserves better tooling | SparkPay',
      description:
        'SparkPay was built to fix Nigerian payroll: salaries, PAYE per state, and statutory remittances, built for how businesses here actually operate.',
      path: '/about',
    }}
  >
    <PageHero
      eyebrow="OUR STORY"
      title="Nigerian payroll deserved better tooling. So we built it."
      lead="SparkPay exists because the tools built elsewhere never understood PAYE per state, PFAs, or NHF — the things that actually matter here."
      visual={<MockupDashboard />}
      visualLabel="SparkPay dashboard showing a payroll run"
    />

    <section className="mkt-section">
      <div className="mkt-container">
        <SectionHeading
          eyebrow="THE ROAD SO FAR"
          title="How SparkPay came to be"
        />
        <div className="mkt-timeline">
          {timeline.map((t) => (
            <div className="mkt-timeline__item" key={t.year}>
              <span className="mkt-timeline__year mkt-figure">{t.year}</span>
              <h3 className="mkt-timeline__title">{t.title}</h3>
              <p className="mkt-timeline__body">{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <FinalCtaBand
      title="Built here, for teams here."
      sub="Payroll, PAYE and remittances that understand Nigerian business."
    />
  </MarketingLayout>
);

export default AboutPage;

import { MarketingButton } from '../../ui/marketing-button.component';
import { BentoCell } from '../../ui/bento-cell.component';
import { Eyebrow } from '../../ui/eyebrow.component';
import { MockupFrame } from '../../ui/mockup-frame.component';
import { StatFigure } from '../../ui/stat-figure.component';
import { FinalCtaBand } from '../final-cta.component';
import { MarketingLayout } from '../marketing-layout.component';
import { MockupDashboard } from '../mockup-dashboard.component';
import { CustomerLogos } from './customer-logos.component';
import { FeatureShowcase } from './feature-showcase.component';
import { Reveal } from './reveal.component';

// Real testimonials, carried over verbatim from the previous site (owner
// confirmed the copy is correct).
const testimonials = [
  {
    name: 'Isaiah',
    role: 'HR, ZEODigitals',
    quote:
      'SparkPay has revolutionized our payment processing. We’ve seen a significant improvement in transaction speeds and a reduction in errors. Their platform is intuitive and their support is top-notch.',
  },
  {
    name: 'Blessing',
    role: 'HR, Clyp Technologies',
    quote:
      'The integration of SparkPay into our existing systems was seamless. Their team provided excellent support throughout the process, and we’ve been impressed with the platform’s reliability and features.',
  },
  {
    name: 'David',
    role: 'Founder, Compas AI',
    quote:
      'SparkPay has been a game-changer. The platform is user-friendly, and the reporting tools provide valuable insights. We highly recommend SparkPay to any business looking for a reliable payment solution.',
  },
];

// ── copy lives here, once (guide §6, §10) ─────────────────────────────
const problemLines = [
  'Salaries typed into a spreadsheet, then sent one bank transfer at a time.',
  "PAYE worked out by hand — and it's not the same in Lagos, Oyo, and Abuja.",
  'A pension or NHF deadline slips in the rush, and a penalty letter follows.',
];

const steps = [
  {
    n: '01',
    title: 'Add your team',
    body: "Import employees and salaries once. Bring a spreadsheet and we'll map it.",
  },
  {
    n: '02',
    title: 'Review the numbers',
    body: 'See every net salary, PAYE deduction, and remittance before a naira moves.',
  },
  {
    n: '03',
    title: 'Approve and relax',
    body: "One approval pays everyone and files the remittances. That's the job.",
  },
];

// mini visuals for the two large bento cells
const PayeVisual = () => (
  <div className="mkt-mini mkt-mini--paye">
    {[
      { state: 'Lagos', rate: '₦184,500' },
      { state: 'Oyo', rate: '₦171,200' },
      { state: 'Rivers', rate: '₦179,800' },
    ].map((r) => (
      <div className="mkt-mini__row" key={r.state}>
        <span>{r.state} IRS</span>
        <span className="mkt-figure">{r.rate}</span>
      </div>
    ))}
  </div>
);

const RemittanceVisual = () => (
  <div className="mkt-mini mkt-mini--remit">
    {[
      { label: 'Pension · PFA', state: 'filed' },
      { label: 'NHF', state: 'filed' },
      { label: 'NSITF', state: 'scheduled' },
    ].map((r) => (
      <div className="mkt-mini__row" key={r.label}>
        <span>{r.label}</span>
        <span className={`mkt-mini__tag mkt-mini__tag--${r.state}`}>
          {r.state === 'filed' ? '✓ Filed' : 'Scheduled'}
        </span>
      </div>
    ))}
  </div>
);

const smallCells = [
  {
    area: 'bulk',
    title: 'Pay everyone in one click',
    body: 'One approval sends every salary straight to their bank.',
    href: '/product',
  },
  {
    area: 'slips',
    title: 'Payslips, sent automatically',
    body: 'Each employee gets a clear payslip the moment payroll runs.',
    href: '/product',
  },
  {
    area: 'audit',
    title: 'Every action on record',
    body: 'A full log of who did what and when — exportable any time.',
    href: '/product',
  },
  {
    area: 'multi',
    title: 'Run several entities at once',
    body: 'Switch between companies from a single login.',
    href: '/product',
  },
];

export const HomePage = () => (
  <MarketingLayout
    seo={{
      title: 'SparkPay — Nigerian payroll, PAYE and remittances on autopilot',
      description:
        'SparkPay disburses salaries, calculates PAYE for every state, and remits pension, NHF and NSITF on time for Nigerian businesses — every month.',
      path: '/',
    }}
  >
    {/* 1 · HERO ------------------------------------------------------- */}
    <section className="mkt-hero">
      <div className="mkt-hero__mesh" aria-hidden="true" />
      <div className="mkt-container mkt-hero__inner">
        <div className="mkt-hero__copy">
          <Eyebrow className="mkt-hero__eyebrow">PAYROLL, DONE</Eyebrow>
          <h1 className="mkt-hero__title">
            <span>The payroll run that took three days</span>{' '}
            <span>now takes three minutes.</span>
          </h1>
          <p className="mkt-hero__subhead">
            SparkPay disburses salaries, calculates PAYE for every state, and
            remits pension, NHF and NSITF on time — for your whole team, every
            month.
          </p>
          <div className="mkt-hero__actions">
            <MarketingButton href="/create-account">
              Run your first payroll free
            </MarketingButton>
            <MarketingButton href="#how-it-works" variant="secondary">
              See how it works
            </MarketingButton>
          </div>
          <p className="mkt-hero__micro mkt-figure">
            Free for your first payroll run · No card required
          </p>
        </div>

        <div className="mkt-hero__visual">
          <MockupFrame
            tilt
            label="SparkPay dashboard showing a July payroll of ₦125,000,000 with employees marked paid, processing and queued"
          >
            <MockupDashboard />
          </MockupFrame>
          <span className="mkt-hero__badge mkt-hero__badge--amount">
            <span className="mkt-figure">₦125,000,000</span> disbursed
          </span>
          <span className="mkt-hero__badge mkt-hero__badge--paye">
            PAYE · Remitted{' '}
            <span className="mkt-hero__badge__check" aria-hidden="true">
              ✓
            </span>
          </span>
        </div>
      </div>
    </section>

    {/* 2 · PROBLEM STRIP (ink) --------------------------------------- */}
    <section className="mkt-problem" data-mkt-dark>
      <div className="mkt-container">
        <Reveal className="mkt-head">
          <Eyebrow onInk>THE OLD WAY</Eyebrow>
          <h2 className="mkt-h2">
            Nigerian payroll is still run on spreadsheets and prayers
          </h2>
        </Reveal>

        <div className="mkt-problem__grid">
          <Reveal className="mkt-problem__list">
            {problemLines.map((line) => (
              <div className="mkt-problem__item" key={line}>
                <span className="mkt-problem__x" aria-hidden="true">
                  ✕
                </span>
                <span>{line}</span>
              </div>
            ))}
          </Reveal>

          {/* stylized spreadsheet fragment */}
          <Reveal className="mkt-problem__artifact" delay={100}>
            <div className="mkt-sheet" aria-hidden="true">
              <div className="mkt-sheet__bar" />
              {[
                ['B12', 'Salary', '=SUM(C2:C40)'],
                ['B13', 'PAYE', '???'],
                ['B14', 'Pension', 'overdue'],
              ].map((row) => (
                <div className="mkt-sheet__row" key={row[0]}>
                  {row.map((cell, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <span className="mkt-sheet__cell mkt-figure" key={i}>
                      {cell}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal className="mkt-problem__pivot">
          <p>
            SparkPay does all of it in a single run — correctly, on time, every
            month.
          </p>
        </Reveal>
      </div>
    </section>

    {/* 3 · HOW IT WORKS ---------------------------------------------- */}
    <section className="mkt-section" id="how-it-works">
      <div className="mkt-container">
        <Reveal className="mkt-head">
          <Eyebrow>HOW IT WORKS</Eyebrow>
          <h2 className="mkt-h2">Three steps, then you can relax</h2>
        </Reveal>

        <div className="mkt-steps">
          <span className="mkt-steps__line" aria-hidden="true" />
          {steps.map((step, i) => (
            <Reveal className="mkt-step" delay={i * 100} key={step.n}>
              <span className="mkt-step__num mkt-figure">{step.n}</span>
              <h3 className="mkt-step__title">{step.title}</h3>
              <p className="mkt-step__body">{step.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* 3.5 · CAPABILITY SHOWCASE ------------------------------------- */}
    <FeatureShowcase />

    {/* 4 · BENTO (ink) ----------------------------------------------- */}
    <section className="mkt-bento-section" data-mkt-dark>
      <div className="mkt-container">
        <Reveal className="mkt-head">
          <Eyebrow onInk>ONE RUN, EVERYTHING</Eyebrow>
          <h2 className="mkt-h2">
            Built for the way Nigerian payroll actually works
          </h2>
        </Reveal>

        <Reveal className="mkt-bento">
          <BentoCell
            area="paye"
            className="mkt-bento-cell--large"
            title="PAYE, correct for every state"
            body="SparkPay applies the right bands and reliefs per state and remits to the correct IRS — Lagos, Oyo, Rivers, all of them."
            href="/features/paye"
            linkLabel="How PAYE works"
            media={<PayeVisual />}
          />
          <BentoCell
            area="remit"
            className="mkt-bento-cell--large"
            title="Pension, NHF, NSITF — remitted on schedule"
            body="Every statutory deduction calculated and filed to the right authority, ahead of the deadline."
            href="/features/remittances"
            linkLabel="See remittances"
            media={<RemittanceVisual />}
          />
          {smallCells.map((c) => (
            <BentoCell
              key={c.area}
              area={c.area}
              title={c.title}
              body={c.body}
              href={c.href}
              linkLabel="Learn more"
            />
          ))}
        </Reveal>
      </div>
    </section>

    {/* 5 · PROOF BAND ------------------------------------------------ */}
    <section className="mkt-section mkt-proof">
      <div className="mkt-container">
        <Reveal>
          <CustomerLogos />
        </Reveal>

        <div className="mkt-proof__stats">
          <StatFigure label="Salaries disbursed" prefix="₦" value={2.4} suffix="bn+" decimals={1} />
          <StatFigure label="Payrolls run" value={12000} suffix="+" />
          <StatFigure label="Hours saved per run" value={40} suffix="+" />
        </div>

        <Reveal className="mkt-head mkt-head--center mkt-proof__head">
          <Eyebrow>WHAT OUR CLIENTS SAY</Eyebrow>
          <h2 className="mkt-h2">
            Businesses that swapped the spreadsheet for SparkPay
          </h2>
        </Reveal>

        <div className="mkt-testimonials">
          {testimonials.map((t, i) => (
            <Reveal
              as="div"
              className="mkt-testimonial"
              delay={i * 90}
              key={t.name}
            >
              <blockquote className="mkt-testimonial__quote">
                {t.quote}
              </blockquote>
              <div className="mkt-testimonial__client">
                <span className="mkt-testimonial__avatar" aria-hidden="true">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="mkt-testimonial__name">{t.name}</span>
                  <span className="mkt-testimonial__role">{t.role}</span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* 6 · FINAL CTA (gradient mesh) --------------------------------- */}
    <FinalCtaBand />
  </MarketingLayout>
);

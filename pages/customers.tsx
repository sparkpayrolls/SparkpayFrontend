import { FinalCtaBand } from '@/components/marketing/final-cta.component';
import { MarketingLayout } from '@/components/marketing/marketing-layout.component';
import { PageHero } from '@/components/marketing/page-hero.component';
import { MockupDashboard } from '@/components/marketing/mockup-dashboard.component';
import { SectionHeading } from '@/components/marketing/section-heading.component';
import { NextPage } from 'next';

// Real testimonials carried over from the previous site. Full case studies are
// on the way (guide §8: honest-but-empty is fine).
const testimonials = [
  {
    name: 'Isaiah',
    role: 'HR, ZEODigitals',
    quote:
      'SparkPay has revolutionized our payment processing. We’ve seen a significant improvement in transaction speeds and a reduction in errors.',
  },
  {
    name: 'Blessing',
    role: 'HR, Clyp Technologies',
    quote:
      'The integration of SparkPay into our existing systems was seamless. We’ve been impressed with the platform’s reliability and features.',
  },
  {
    name: 'David',
    role: 'Founder, Compas AI',
    quote:
      'SparkPay has been a game-changer. The platform is user-friendly, and the reporting tools provide valuable insights.',
  },
];

const caseStudies = [
  { industry: 'Fintech', company: 'CreditChek' },
  { industry: 'Agriculture', company: 'Afrimash' },
  { industry: 'Health', company: 'Dobic Health' },
];

const CustomersPage: NextPage = () => (
  <MarketingLayout
    seo={{
      title: 'Customers — teams running payroll on SparkPay',
      description:
        'Nigerian businesses use SparkPay to run payroll, calculate PAYE, and remit statutory deductions. Hear from teams who swapped the spreadsheet for SparkPay.',
      path: '/customers',
    }}
  >
    <PageHero
      eyebrow="CUSTOMERS"
      title="Teams that stopped dreading payday."
      lead="From fintechs to logistics firms, Nigerian businesses run their whole payroll on SparkPay."
      visual={<MockupDashboard />}
      visualLabel="SparkPay dashboard"
    />

    <section className="mkt-section">
      <div className="mkt-container">
        <SectionHeading eyebrow="IN THEIR WORDS" title="What customers say" />
        <div className="mkt-testimonials" style={{ marginTop: '2.5rem' }}>
          {testimonials.map((t) => (
            <div className="mkt-testimonial" key={t.name}>
              <blockquote className="mkt-testimonial__quote">{t.quote}</blockquote>
              <div className="mkt-testimonial__client">
                <span className="mkt-testimonial__avatar" aria-hidden="true">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="mkt-testimonial__name">{t.name}</span>
                  <span className="mkt-testimonial__role">{t.role}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="mkt-section" style={{ background: 'var(--bg-canvas)' }}>
      <div className="mkt-container">
        <SectionHeading
          eyebrow="CASE STUDIES"
          title="Deeper stories, coming soon"
          lead="Full case studies are on the way. Two strong stories beat six fake logos."
        />
        <div className="mkt-cards">
          {caseStudies.map((c) => (
            <div className="mkt-card" key={c.company}>
              <div className="mkt-card__media">{c.company}</div>
              <div className="mkt-card__body">
                <span className="mkt-card__tag">{c.industry}</span>
                <h3 className="mkt-card__title">{c.company}</h3>
                <p className="mkt-card__excerpt">
                  How {c.company} runs payroll on SparkPay.
                </p>
                <span className="mkt-card__todo">Coming soon</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <FinalCtaBand />
  </MarketingLayout>
);

export default CustomersPage;

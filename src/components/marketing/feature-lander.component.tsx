import Head from 'next/head';
import { ReactNode } from 'react';
import { FaqAccordion, FaqItem } from '../ui/faq-accordion.component';
import { MarketingButton } from '../ui/marketing-button.component';
import { MockupFrame } from '../ui/mockup-frame.component';
import { FinalCtaBand } from './final-cta.component';
import { MarketingLayout, MarketingSeo } from './marketing-layout.component';
import { PageHero } from './page-hero.component';
import { SectionHeading } from './section-heading.component';

export type FeatureLanderProps = {
  seo: MarketingSeo;
  eyebrow: string;
  h1: string;
  lead: string;
  heroVisual?: ReactNode;
  beats: { title: string; body: string }[];
  example: {
    heading: string;
    lead: string;
    rows: { label: string; value: string; accent?: boolean }[];
    visual: ReactNode;
  };
  faq: FaqItem[];
};

export const FeatureLander = (props: FeatureLanderProps) => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: props.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <MarketingLayout seo={props.seo}>
      <Head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </Head>

      {/* hero — states the compliance pain */}
      <PageHero
        eyebrow={props.eyebrow}
        title={props.h1}
        lead={props.lead}
        visual={props.heroVisual}
        actions={
          <>
            <MarketingButton href="/create-account">
              Run your first payroll free
            </MarketingButton>
            <MarketingButton href="/product" variant="secondary">
              See the product
            </MarketingButton>
          </>
        }
      />

      {/* three beats */}
      <section className="mkt-section">
        <div className="mkt-container">
          <div className="mkt-steps">
            {props.beats.map((b, i) => (
              <div className="mkt-step" key={b.title}>
                <span className="mkt-step__num mkt-figure">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mkt-step__title">{b.title}</h3>
                <p className="mkt-step__body">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* worked example, real-shaped numbers in mono */}
      <section className="mkt-section" style={{ background: 'var(--bg-canvas)' }}>
        <div className="mkt-container">
          <div className="mkt-split">
            <div className="mkt-split__copy">
              <SectionHeading
                eyebrow="A WORKED EXAMPLE"
                title={props.example.heading}
                lead={props.example.lead}
              />
              <div className="mkt-worked">
                {props.example.rows.map((r) => (
                  <div className="mkt-worked__row" key={r.label}>
                    <span>{r.label}</span>
                    <span
                      className={`mkt-figure${
                        r.accent ? ' mkt-worked__accent' : ''
                      }`}
                    >
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mkt-split__visual">
              <MockupFrame className="mkt-visual-tilt">
                {props.example.visual}
              </MockupFrame>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mkt-section">
        <div className="mkt-container">
          <SectionHeading
            center
            eyebrow="QUESTIONS"
            title="What Nigerian businesses ask us"
          />
          <FaqAccordion items={props.faq} />
        </div>
      </section>

      <FinalCtaBand />
    </MarketingLayout>
  );
};

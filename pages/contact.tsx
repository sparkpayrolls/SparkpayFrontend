import { MarketingLayout } from '@/components/marketing/marketing-layout.component';
import { PageHero } from '@/components/marketing/page-hero.component';
import { MockupRemittance } from '@/components/marketing/mockups/product-mockups.component';
import { MarketingButton } from '@/components/ui/marketing-button.component';
import { NextPage } from 'next';
import { useState } from 'react';

const ContactPage: NextPage = () => {
  // form stub — wired to a real endpoint later (guide §8)
  const [sent, setSent] = useState(false);

  return (
    <MarketingLayout
      seo={{
        title: 'Contact SparkPay — talk to us about payroll',
        description:
          'Get in touch with SparkPay about payroll, PAYE and statutory remittances for your Nigerian business, or request a demo.',
        path: '/contact',
      }}
    >
      <PageHero
        eyebrow="CONTACT"
        title="Talk to us."
        lead="Questions about payroll, PAYE, or moving from your current process? We’re happy to help."
        visual={<MockupRemittance />}
        visualLabel="SparkPay remittance schedule"
      />

      <section className="mkt-section" style={{ paddingTop: 0 }}>
        <div className="mkt-container">
          <div className="mkt-contact-grid">
            <form
              className="mkt-form"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="mkt-form__field">
                <label htmlFor="c-name">Name</label>
                <input id="c-name" name="name" required />
              </div>
              <div className="mkt-form__field">
                <label htmlFor="c-email">Work email</label>
                <input id="c-email" name="email" type="email" required />
              </div>
              <div className="mkt-form__field">
                <label htmlFor="c-size">Company size</label>
                <select id="c-size" name="size">
                  <option>1–10 employees</option>
                  <option>11–50 employees</option>
                  <option>51–200 employees</option>
                  <option>200+ employees</option>
                </select>
              </div>
              <div className="mkt-form__field">
                <label htmlFor="c-msg">Message</label>
                <textarea id="c-msg" name="message" />
              </div>
              <MarketingButton type="submit">
                {sent ? 'Thanks — we’ll be in touch' : 'Send message'}
              </MarketingButton>
            </form>

            <aside className="mkt-contact-grid__aside">
              <h3>Prefer email?</h3>
              <p>
                Reach us at{' '}
                <a href="mailto:support@sparkpayhq.com">support@sparkpayhq.com</a>
                .
              </p>
              <h3>Want to see it live?</h3>
              <p>Book a walkthrough and we&rsquo;ll run a payroll with you.</p>
              <MarketingButton href="/book-a-demo" variant="secondary" size="sm">
                Book a demo
              </MarketingButton>
            </aside>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default ContactPage;

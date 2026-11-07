import { SectionHeading } from '../section-heading.component';
import {
  MockupCustomPayment,
  MockupPayslip,
} from '../mockups/showcase-mockups.component';
import { Reveal } from './reveal.component';

/**
 * Two-up capability showcase (Automated Payslips + Custom Schedules), each with
 * a re-skinned product mockup. Modelled on the reference the owner supplied.
 */
export const FeatureShowcase = () => (
  <section className="mkt-showcase">
    <div className="mkt-container">
      {/* Every other section on this page runs eyebrow -> h2 -> lead. This one
          had neither, so two sibling h2s sat on the page with nothing above
          them — orphaned in the outline and unframed on screen. */}
      <SectionHeading
        eyebrow="IN THE PRODUCT"
        title="What your team actually sees"
        lead="The payslip that lands in their inbox, and the control you keep over how and when people are paid."
      />
    </div>
    <div className="mkt-container mkt-showcase__grid">
      <Reveal className="mkt-showcase__card mkt-showcase__card--a">
        <h3 className="mkt-showcase__title">Automated payslips</h3>
        <p className="mkt-showcase__body">
          Auto-generated payslips, narrated in plain terms and delivered to
          employee accounts and emails the moment payroll runs.
        </p>
        <div className="mkt-showcase__visual">
          <MockupPayslip />
        </div>
      </Reveal>

      <Reveal className="mkt-showcase__card mkt-showcase__card--b" delay={100}>
        <h3 className="mkt-showcase__title">Custom pay schedules</h3>
        <p className="mkt-showcase__body">
          Run payroll to fit your operations, or split a salary across different
          accounts — single or multiple transfers, your call.
        </p>
        <div className="mkt-showcase__visual">
          <MockupCustomPayment />
        </div>
      </Reveal>
    </div>
  </section>
);

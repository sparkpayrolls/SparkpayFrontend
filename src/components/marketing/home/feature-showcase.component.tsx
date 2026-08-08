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
    <div className="mkt-container mkt-showcase__grid">
      <Reveal className="mkt-showcase__card mkt-showcase__card--a">
        <h2 className="mkt-showcase__title">Automated Payslips</h2>
        <p className="mkt-showcase__body">
          Auto-generated payslips, narrated in plain terms and delivered to
          employee accounts and emails the moment payroll runs.
        </p>
        <div className="mkt-showcase__visual">
          <MockupPayslip />
        </div>
      </Reveal>

      <Reveal className="mkt-showcase__card mkt-showcase__card--b" delay={100}>
        <h2 className="mkt-showcase__title">Set up custom schedules</h2>
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

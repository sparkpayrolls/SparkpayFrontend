// MARKETING RECREATIONS — not live screenshots (guide §9). Payslip + custom
// payment screens, re-skinned to the token system with sample data.

// ── Automated payslip summary ─────────────────────────────────────────
export const MockupPayslip = () => (
  <div className="mkt-slip">
    <div className="mkt-slip__bar">
      <span className="mkt-slip__back" aria-hidden="true">
        ‹
      </span>
      December payslip summary
    </div>

    <div className="mkt-slip__body">
      <div className="mkt-slip__intro">
        <div>
          <p className="mkt-slip__lead">Your December pay, in full.</p>
          <p className="mkt-slip__period">
            Pay period <strong>1&ndash;31 December</strong>
          </p>
        </div>
        <div className="mkt-slip__total">
          <span className="mkt-slip__total-label">Take home</span>
          <span className="mkt-slip__total-amt mkt-figure">623,000</span>
        </div>
      </div>

      <div className="mkt-slip__table">
        <div className="mkt-slip__row mkt-slip__row--head">
          <span>Summary</span>
          <span />
        </div>
        <div className="mkt-slip__row">
          <span>Gross salary</span>
          <span className="mkt-figure">850,000</span>
        </div>
        <div className="mkt-slip__row">
          <span>Income tax</span>
          <span className="mkt-figure mkt-slip__minus">&minus;184,500</span>
        </div>
        <div className="mkt-slip__row">
          <span>Pension</span>
          <span className="mkt-figure mkt-slip__minus">&minus;42,500</span>
        </div>
        <div className="mkt-slip__row mkt-slip__row--total">
          <span>Take home</span>
          <span className="mkt-figure">623,000</span>
        </div>
      </div>

      <button type="button" className="mkt-slip__btn" tabIndex={-1}>
        Download payslip
      </button>
    </div>
  </div>
);

// ── Custom payment for employees ──────────────────────────────────────
export const MockupCustomPayment = () => (
  <div className="mkt-pay">
    <p className="mkt-pay__title">Custom payment for employees</p>

    <span className="mkt-pay__label">Choose type of transfer</span>
    <div className="mkt-pay__radios">
      <span className="mkt-pay__radio mkt-pay__radio--on">
        <span className="mkt-pay__dot" aria-hidden="true" />
        Single transfer
      </span>
      <span className="mkt-pay__radio">
        <span className="mkt-pay__dot mkt-pay__dot--off" aria-hidden="true" />
        Multiple transfer
      </span>
    </div>

    <div className="mkt-pay__grid">
      <div className="mkt-pay__field">
        <span className="mkt-pay__label">Employees</span>
        <span className="mkt-pay__input mkt-pay__input--filled">
          Engineering &middot; 12 people
        </span>
      </div>
      <div className="mkt-pay__field">
        <span className="mkt-pay__label">Amount each</span>
        <span className="mkt-pay__input mkt-pay__input--filled mkt-figure">
          450,000
        </span>
      </div>
    </div>

    <div className="mkt-pay__field">
      <span className="mkt-pay__label">Description</span>
      <span className="mkt-pay__input mkt-pay__input--wide mkt-pay__input--filled">
        December salaries
      </span>
    </div>

    <label className="mkt-pay__confirm">
      <span className="mkt-pay__check mkt-pay__check--on" aria-hidden="true" />I
      confirm the payment details above
    </label>

    <div className="mkt-pay__actions">
      <span className="mkt-pay__btn mkt-pay__btn--ghost">Cancel</span>
      <span className="mkt-pay__btn mkt-pay__btn--primary">Confirm</span>
    </div>
  </div>
);

// MARKETING RECREATIONS — not live screenshots (guide §9). Payslip + custom
// payment screens, re-skinned to the token system with Nigerian data.

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
        <p className="mkt-slip__lead">
          Here&rsquo;s a detailed breakdown of your earnings for this pay period.
        </p>
        <div className="mkt-slip__coin">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/coin.png" alt="" className="mkt-slip__coin-img" />
          <span className="mkt-slip__coin-amt mkt-figure">₦500,000</span>
          <span className="mkt-slip__coin-label">Total Earnings</span>
        </div>
      </div>

      <p className="mkt-slip__period">
        Payroll Period: <strong>Dec 1 to December 30</strong>
      </p>

      <div className="mkt-slip__table">
        <div className="mkt-slip__row mkt-slip__row--head">
          <span>Summary</span>
          <span />
        </div>
        <div className="mkt-slip__row">
          <span>Earnings</span>
          <span className="mkt-figure">₦500,000</span>
        </div>
        <div className="mkt-slip__row">
          <span>Deduction</span>
          <span className="mkt-figure">₦0.00</span>
        </div>
        <div className="mkt-slip__row mkt-slip__row--total">
          <span>Take home</span>
          <span className="mkt-figure">₦500,000</span>
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
        <span className="mkt-pay__label">Select employees</span>
        <span className="mkt-pay__input" />
      </div>
      <div className="mkt-pay__field">
        <span className="mkt-pay__label">Enter amount</span>
        <span className="mkt-pay__input mkt-figure">₦500,000</span>
      </div>
    </div>

    <div className="mkt-pay__field">
      <span className="mkt-pay__label">Payment description</span>
      <span className="mkt-pay__input mkt-pay__input--wide" />
    </div>

    <label className="mkt-pay__confirm">
      <span className="mkt-pay__check" aria-hidden="true" />
      I confirm the payment details above
    </label>

    <div className="mkt-pay__actions">
      <span className="mkt-pay__btn mkt-pay__btn--ghost">Cancel</span>
      <span className="mkt-pay__btn mkt-pay__btn--primary">Confirm</span>
    </div>
  </div>
);

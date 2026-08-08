// Scrolling "trusted by" strip of real SparkPay customers, shown as wordmarks
// (swap for logo SVGs when available).
// NOTE: the guide (§7) discourages marquees; this scroll is an explicit product
// decision and is frozen under prefers-reduced-motion.

const customers = [
  'Trixt Innovations',
  'FieldBase',
  'CreditChek',
  'Remote WorkHER',
  'LearnDelta',
  'ZEODigital',
  'Dobic Health',
  'Hybrid Heights',
  'CompasAI',
  'Afrimash',
  'Victoria Court',
  'Flitstack',
  'Our Haven',
  'HelpMum',
];

export const CustomerLogos = () => (
  <div className="mkt-logos">
    <p className="mkt-logos__label">Trusted by teams across Nigeria</p>

    <div className="mkt-logos__viewport">
      {/* two identical tracks for a seamless loop */}
      <div className="mkt-logos__track" aria-hidden="true">
        {[...customers, ...customers].map((name, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <span className="mkt-logos__item" key={`${name}-${i}`}>
            {name}
          </span>
        ))}
      </div>

      {/* accessible, non-animated copy for screen readers */}
      <span className="mkt-visually-hidden">
        Customers include {customers.join(', ')}.
      </span>
    </div>
  </div>
);

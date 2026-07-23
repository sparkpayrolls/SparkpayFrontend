// MARKETING RECREATIONS — not live screenshots (guide §9). Lightweight HTML/CSS
// rebuilds of key SparkPay screens, re-skinned to the token system, with
// realistic Nigerian data. Reused as side-views and background decor.

// ── Organisation list (multi-company) ─────────────────────────────────
// Rendered as a loading skeleton: real customer names are withheld for
// privacy, so no company is implied to be a customer.
export const MockupOrgs = () => (
  <div className="mkt-rec mkt-rec--orgs">
    <div className="mkt-rec__head">
      <span className="mkt-rec__title">My organisations</span>
      <span className="mkt-rec__hint">Switch anytime</span>
    </div>
    {[0, 1, 2, 3].map((i) => (
      <div className="mkt-rec__row" key={i}>
        <span className="mkt-rec__ident">
          <span className="mkt-skel mkt-skel--avatar" aria-hidden="true" />
          <span className="mkt-rec__skel-lines">
            <span
              className="mkt-skel mkt-skel--line"
              style={{ width: `${88 - i * 10}px` }}
              aria-hidden="true"
            />
            <span
              className="mkt-skel mkt-skel--line mkt-skel--sm"
              aria-hidden="true"
            />
          </span>
        </span>
        <span
          className="mkt-skel mkt-skel--amount"
          aria-hidden="true"
        />
      </div>
    ))}
    <span className="mkt-visually-hidden">Loading your organisations</span>
  </div>
);

// ── Audit trail ───────────────────────────────────────────────────────
const audits = [
  { name: 'Esther Howard', act: 'Logged in', role: 'Admin' },
  { name: 'Brooklyn Simmons', act: 'Suspended Esther Howard', role: 'Super Admin' },
  { name: 'Ralph Edwards', act: 'Ran July payroll', role: 'Payroll Manager' },
  { name: 'Bessie Cooper', act: 'Exported audit log', role: 'Viewer' },
];

export const MockupAudit = () => (
  <div className="mkt-rec mkt-rec--audit">
    <div className="mkt-rec__head">
      <span className="mkt-rec__title">Audit trail</span>
      <span className="mkt-rec__hint">120 logs</span>
    </div>
    {audits.map((a) => (
      <div className="mkt-rec__row" key={a.name + a.act}>
        <span className="mkt-rec__ident">
          <span className="mkt-rec__badge mkt-rec__badge--soft">
            {a.name.charAt(0)}
          </span>
          <span>
            <span className="mkt-rec__name">{a.name}</span>
            <span className="mkt-rec__sub">{a.act}</span>
          </span>
        </span>
        <span className="mkt-rec__tag">{a.role}</span>
      </div>
    ))}
  </div>
);

// ── Remittance schedule ───────────────────────────────────────────────
const remits = [
  { label: 'PAYE · Lagos IRS', due: 'Due 10 Aug', state: 'filed' },
  { label: 'Pension · Stanbic PFA', due: 'Due 12 Aug', state: 'filed' },
  { label: 'NHF · FMBN', due: 'Due 15 Aug', state: 'scheduled' },
  { label: 'NSITF', due: 'Due 20 Aug', state: 'scheduled' },
];

export const MockupRemittance = () => (
  <div className="mkt-rec mkt-rec--remit">
    <div className="mkt-rec__head">
      <span className="mkt-rec__title">Remittance schedule</span>
      <span className="mkt-rec__hint">August</span>
    </div>
    {remits.map((r) => (
      <div className="mkt-rec__row" key={r.label}>
        <span>
          <span className="mkt-rec__name">{r.label}</span>
          <span className="mkt-rec__sub">{r.due}</span>
        </span>
        <span
          className={`mkt-rec__status mkt-rec__status--${r.state}`}
        >
          {r.state === 'filed' ? '✓ Filed' : 'Scheduled'}
        </span>
      </div>
    ))}
  </div>
);

// ── PAYE per state ────────────────────────────────────────────────────
const payeRows = [
  { state: 'Lagos', gross: '₦850,000', paye: '₦184,500' },
  { state: 'Oyo', gross: '₦850,000', paye: '₦171,200' },
  { state: 'Rivers', gross: '₦850,000', paye: '₦179,800' },
  { state: 'FCT Abuja', gross: '₦850,000', paye: '₦176,400' },
];

export const MockupPaye = () => (
  <div className="mkt-rec mkt-rec--paye">
    <div className="mkt-rec__head">
      <span className="mkt-rec__title">PAYE by state</span>
      <span className="mkt-rec__hint">Same gross</span>
    </div>
    <div className="mkt-rec__row mkt-rec__row--header">
      <span>State</span>
      <span className="mkt-rec__amount">Gross</span>
      <span className="mkt-rec__amount">PAYE</span>
    </div>
    {payeRows.map((r) => (
      <div className="mkt-rec__row mkt-rec__row--3" key={r.state}>
        <span className="mkt-rec__name">{r.state}</span>
        <span className="mkt-rec__amount mkt-figure">{r.gross}</span>
        <span className="mkt-rec__amount mkt-figure mkt-rec__paye">
          {r.paye}
        </span>
      </div>
    ))}
  </div>
);

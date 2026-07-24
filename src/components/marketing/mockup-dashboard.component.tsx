// MARKETING RECREATION — not a live screenshot.
// A lightweight HTML/CSS rebuild of the SparkPay dashboard for the hero, using
// the token system so it reads as the same brand (guide §9). All data is
// realistic, varied, Nigerian; never four identical rows.

const runs: { name: string; dept: string; amount: string; status: 'paid' | 'processing' | 'queued' }[] = [
  { name: 'Adaeze Okafor', dept: 'Engineering', amount: '₦2,340,000', status: 'paid' },
  { name: 'Tunde Bakare', dept: 'Operations', amount: '₦184,500', status: 'paid' },
  { name: 'Chidinma Nwosu', dept: 'Finance', amount: '₦675,000', status: 'processing' },
  { name: 'Emeka Obi', dept: 'Sales', amount: '₦910,200', status: 'queued' },
];

const statusLabel: Record<string, string> = {
  paid: 'Paid',
  processing: 'Processing',
  queued: 'Queued',
};

// area-chart geometry (brand ramp, answers "disbursement trend")
const AREA_POINTS = '0,58 40,50 80,54 120,36 160,40 200,22 240,26 300,10';

const AreaChart = () => (
  <svg
    className="mkt-dash__chart"
    viewBox="0 0 300 72"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="mktDashFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--brand-600)" stopOpacity="0.28" />
        <stop offset="100%" stopColor="var(--brand-600)" stopOpacity="0" />
      </linearGradient>
    </defs>
    <polygon points={`0,72 ${AREA_POINTS} 300,72`} fill="url(#mktDashFill)" />
    <polyline
      points={AREA_POINTS}
      fill="none"
      stroke="var(--brand-600)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MockupDashboard = () => (
  <div className="mkt-dash">
    <div className="mkt-dash__topbar">
      <span className="mkt-dash__brand">
        <span className="mkt-dash__dot" aria-hidden="true" />
        SparkPay
      </span>
      <span className="mkt-dash__crumb">July payroll</span>
    </div>

    <div className="mkt-dash__hero-strip">
      <div>
        <p className="mkt-dash__eyebrow">Total disbursed this run</p>
        <p className="mkt-dash__figure mkt-figure">₦125,000,000</p>
        <p className="mkt-dash__delta">
          <span className="mkt-dash__delta-up">▲ 4.2%</span> vs June
        </p>
      </div>
      <div className="mkt-dash__chart-wrap">
        <AreaChart />
        <span className="mkt-dash__chart-caption">Jan — Jul</span>
      </div>
    </div>

    <div className="mkt-dash__table">
      <div className="mkt-dash__table-head">
        <span>Employee</span>
        <span>Department</span>
        <span>Net pay</span>
        <span>Status</span>
      </div>
      {runs.map((r) => (
        <div className="mkt-dash__row" key={r.name}>
          <span className="mkt-dash__person">
            <span className="mkt-dash__avatar" aria-hidden="true">
              {r.name.charAt(0)}
            </span>
            {r.name}
          </span>
          <span className="mkt-dash__muted">{r.dept}</span>
          <span className="mkt-dash__amount mkt-figure">{r.amount}</span>
          <span>
            <span className={`mkt-dash__pill mkt-dash__pill--${r.status}`}>
              {statusLabel[r.status]}
            </span>
          </span>
        </div>
      ))}
    </div>
  </div>
);

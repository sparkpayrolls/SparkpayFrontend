// Shared helpers for the booking flow. All slot instants are UTC ISO strings
// from the API; we only format them for display in the chosen timezone.

export const DEFAULT_TIMEZONE = 'Africa/Lagos';

// a small curated list; the visitor's detected zone is prepended at runtime
export const COMMON_TIMEZONES = [
  'Africa/Lagos',
  'Africa/Accra',
  'Africa/Nairobi',
  'Africa/Johannesburg',
  'Europe/London',
  'Europe/Berlin',
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Dubai',
  'UTC',
];

export const detectTimeZone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIMEZONE;
  } catch (e) {
    return DEFAULT_TIMEZONE;
  }
};

export const timeZoneOptions = (): string[] => {
  const detected = detectTimeZone();
  return Array.from(new Set([detected, ...COMMON_TIMEZONES]));
};

/** Format a UTC ISO instant as a time label in a timezone (12h or 24h). */
export const formatSlotTime = (
  iso: string,
  timeZone: string,
  hour12: boolean,
): string =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12,
  }).format(new Date(iso));

export const formatFullWhen = (
  iso: string,
  timeZone: string,
  hour12: boolean,
): string =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12,
    timeZoneName: 'short',
  }).format(new Date(iso));

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export type CalendarCell = { day: number | null; iso?: string };

/**
 * Build a Monday-first grid for a month. `day` is null for padding cells.
 * The date is treated as a plain calendar (business-tz) date.
 */
export const buildMonthGrid = (year: number, month: number): CalendarCell[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  // JS: 0=Sun..6=Sat; shift so Monday=0
  const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7;

  const cells: CalendarCell[] = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d += 1) {
    const iso = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(
      2,
      '0',
    )}`;
    cells.push({ day: d, iso });
  }
  return cells;
};

export const toDateParam = (year: number, month: number, day: number): string =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

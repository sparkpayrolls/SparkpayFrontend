import classNames from 'classnames';
import {
  buildMonthGrid,
  MONTH_NAMES,
  WEEKDAY_LABELS,
} from './demo-booking.util';

type BookingCalendarProps = {
  year: number;
  month: number; // 1-12
  availableDays: number[];
  selectedDay: number | null;
  loading?: boolean;
  canGoPrev: boolean;
  onSelectDay(_day: number): void;
  onPrevMonth(): void;
  onNextMonth(): void;
};

export const BookingCalendar = (props: BookingCalendarProps) => {
  const available = new Set(props.availableDays);
  const cells = buildMonthGrid(props.year, props.month);

  return (
    <div className="demo-cal" aria-busy={props.loading}>
      <div className="demo-cal__head">
        <span className="demo-cal__month">
          {MONTH_NAMES[props.month - 1]} {props.year}
        </span>
        <div className="demo-cal__nav">
          <button
            type="button"
            aria-label="Previous month"
            className="demo-cal__nav-btn"
            onClick={props.onPrevMonth}
            disabled={!props.canGoPrev || props.loading}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next month"
            className="demo-cal__nav-btn"
            onClick={props.onNextMonth}
            disabled={props.loading}
          >
            ›
          </button>
        </div>
      </div>

      <div className="demo-cal__weekdays">
        {WEEKDAY_LABELS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      <div className="demo-cal__grid">
        {cells.map((cell, i) => {
          if (cell.day === null) {
            // eslint-disable-next-line react/no-array-index-key
            return <span key={`pad-${i}`} className="demo-cal__pad" />;
          }
          const isAvailable = available.has(cell.day);
          const isSelected = props.selectedDay === cell.day;
          return (
            <button
              type="button"
              key={cell.iso}
              className={classNames('demo-cal__day', {
                'demo-cal__day--available': isAvailable,
                'demo-cal__day--selected': isSelected,
              })}
              disabled={!isAvailable || props.loading}
              aria-pressed={isSelected}
              onClick={() => props.onSelectDay(cell.day as number)}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

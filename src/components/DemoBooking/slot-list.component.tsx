import classNames from 'classnames';
import { SlotItem } from 'src/api/modules/demo-booking.module';
import { formatSlotTime, timeZoneOptions } from './demo-booking.util';

type SlotListProps = {
  slots: SlotItem[];
  timezone: string;
  hour12: boolean;
  selected: string | null;
  loading?: boolean;
  error?: string;
  dayLabel?: string;
  onSelectSlot(_iso: string): void;
  onChangeTimezone(_tz: string): void;
  onToggleHourFormat(): void;
  onRetry?(): void;
};

export const SlotList = (props: SlotListProps) => {
  return (
    <div className="demo-slots">
      <div className="demo-slots__head">
        <span className="demo-slots__day">
          {props.dayLabel || 'Pick a time'}
        </span>
        <button
          type="button"
          className="demo-slots__format"
          onClick={props.onToggleHourFormat}
          aria-label="Toggle 12 or 24 hour time"
        >
          {props.hour12 ? '12h' : '24h'}
        </button>
      </div>

      <label className="demo-slots__tz">
        <span className="demo-slots__tz-label">Timezone</span>
        <select
          value={props.timezone}
          onChange={(e) => props.onChangeTimezone(e.target.value)}
          className="demo-slots__tz-select"
        >
          {timeZoneOptions().map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </label>

      <div className="demo-slots__body">
        {props.loading && (
          <div className="demo-slots__state">Loading times…</div>
        )}

        {!props.loading && props.error && (
          <div className="demo-slots__state demo-slots__state--error">
            <p>{props.error}</p>
            {props.onRetry && (
              <button
                type="button"
                className="demo-slots__retry"
                onClick={props.onRetry}
              >
                Try again
              </button>
            )}
          </div>
        )}

        {!props.loading && !props.error && props.slots.length === 0 && (
          <div className="demo-slots__state">
            No times available on this day. Please pick another.
          </div>
        )}

        {!props.loading && !props.error && props.slots.length > 0 && (
          <ul className="demo-slots__list">
            {props.slots.map((slot) => (
              <li key={slot.startTime}>
                <button
                  type="button"
                  className={classNames('demo-slots__slot', {
                    'demo-slots__slot--selected':
                      props.selected === slot.startTime,
                  })}
                  onClick={() => props.onSelectSlot(slot.startTime)}
                >
                  {formatSlotTime(slot.startTime, props.timezone, props.hour12)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

import { formatFullWhen } from './demo-booking.util';

type BookingConfirmationProps = {
  reference: string;
  slotIso: string;
  timezone: string;
  hour12: boolean;
};

export const BookingConfirmation = (props: BookingConfirmationProps) => (
  <div className="demo-confirm">
    <div className="demo-confirm__check" aria-hidden="true">
      ✓
    </div>
    <h2 className="demo-confirm__title">Request received</h2>
    <p className="demo-confirm__lead">
      Thanks — your demo request is <strong>pending confirmation</strong>. We&rsquo;ll
      email you the meeting details once our team confirms.
    </p>

    <div className="demo-confirm__card">
      <div className="demo-confirm__row">
        <span>When</span>
        <span>{formatFullWhen(props.slotIso, props.timezone, props.hour12)}</span>
      </div>
      <div className="demo-confirm__row">
        <span>Reference</span>
        <code>{props.reference}</code>
      </div>
    </div>

    <p className="demo-confirm__note">
      A confirmation email is on its way. You can manage or cancel this request
      from that email.
    </p>
  </div>
);

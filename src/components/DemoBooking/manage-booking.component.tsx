import { useCallback, useEffect, useState } from 'react';
import { $api } from 'src/api';
import { ManagedBooking } from 'src/api/modules/demo-booking.module';
import { MarketingButton } from '@/components/ui/marketing-button.component';
import { formatFullWhen } from './demo-booking.util';

type ManageBookingProps = { token: string };

export const ManageBooking = (props: ManageBookingProps) => {
  const [booking, setBooking] = useState<ManagedBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setBooking(await $api.demoBooking.getByToken(props.token));
    } catch (e) {
      setError('We couldn’t find that booking. The link may be invalid.');
    } finally {
      setLoading(false);
    }
  }, [props.token]);

  useEffect(() => {
    load();
  }, [load]);

  const cancel = async () => {
    setCancelling(true);
    setError('');
    try {
      const res = await $api.demoBooking.cancelByToken(props.token);
      setBooking((b) => (b ? { ...b, status: res.status } : b));
    } catch (e) {
      setError('Sorry, we couldn’t cancel that. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <div className="demo-manage__state">Loading your booking…</div>;
  }

  if (error && !booking) {
    return <div className="demo-manage__state demo-manage__state--error">{error}</div>;
  }

  if (!booking) return null;

  const cancelled = booking.status === 'CANCELLED';

  return (
    <div className="demo-manage">
      <h2 className="demo-manage__title">Your demo booking</h2>

      <div className="demo-confirm__card">
        <div className="demo-confirm__row">
          <span>When</span>
          <span>{formatFullWhen(booking.startTime, booking.timezone, true)}</span>
        </div>
        <div className="demo-confirm__row">
          <span>Reference</span>
          <code>{booking.reference}</code>
        </div>
        <div className="demo-confirm__row">
          <span>Status</span>
          <span className={`demo-manage__status demo-manage__status--${booking.status.toLowerCase()}`}>
            {booking.status}
          </span>
        </div>
        {booking.meetingLink && !cancelled && (
          <div className="demo-confirm__row">
            <span>Meeting</span>
            <a href={booking.meetingLink} target="_blank" rel="noreferrer">
              Join link
            </a>
          </div>
        )}
      </div>

      {error && <p className="demo-form__error">{error}</p>}

      {cancelled ? (
        <p className="demo-manage__cancelled">This booking has been cancelled.</p>
      ) : (
        <button
          type="button"
          className="demo-manage__cancel"
          onClick={cancel}
          disabled={cancelling}
        >
          {cancelling ? 'Cancelling…' : 'Cancel this booking'}
        </button>
      )}

      <div className="demo-manage__rebook">
        <MarketingButton href="/book-a-demo" variant="secondary">
          Book another time
        </MarketingButton>
      </div>
    </div>
  );
};

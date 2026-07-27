import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { SlotItem } from 'src/api/modules/demo-booking.module';
import { MarketingLayout } from '@/components/marketing/marketing-layout.component';
import { BookingCalendar } from '@/components/DemoBooking/booking-calendar.component';
import { SlotList } from '@/components/DemoBooking/slot-list.component';
import { BookingForm } from '@/components/DemoBooking/booking-form.component';
import { BookingConfirmation } from '@/components/DemoBooking/booking-confirmation.component';
import { ManageBooking } from '@/components/DemoBooking/manage-booking.component';
import {
  DEFAULT_TIMEZONE,
  MONTH_NAMES,
  detectTimeZone,
  toDateParam,
} from '@/components/DemoBooking/demo-booking.util';

type Step = 'pick' | 'details' | 'confirmed';

const BookADemo: NextPage = () => {
  const router = useRouter();
  const manageToken =
    typeof router.query.manage === 'string' ? router.query.manage : '';

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-12

  const [availableDays, setAvailableDays] = useState<number[]>([]);
  const [loadingDays, setLoadingDays] = useState(false);

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [timezone, setTimezone] = useState(DEFAULT_TIMEZONE);
  const [hour12, setHour12] = useState(true);

  const [step, setStep] = useState<Step>('pick');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [reference, setReference] = useState('');

  // detect the visitor's timezone on the client
  useEffect(() => {
    setTimezone(detectTimeZone());
  }, []);

  const currentMonthStart =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month > today.getMonth() + 1);
  const canGoPrev = currentMonthStart;

  const loadDays = useCallback(async () => {
    setLoadingDays(true);
    try {
      const res = await $api.demoBooking.getAvailableDays(year, month);
      setAvailableDays(res.availableDays);
    } catch (e) {
      setAvailableDays([]);
    } finally {
      setLoadingDays(false);
    }
  }, [year, month]);

  useEffect(() => {
    loadDays();
  }, [loadDays]);

  const loadSlots = useCallback(
    async (day: number) => {
      setLoadingSlots(true);
      setSlotsError('');
      setSelectedSlot(null);
      try {
        const res = await $api.demoBooking.getAvailableSlots(
          toDateParam(year, month, day),
          timezone,
        );
        setSlots(res.slots);
      } catch (e) {
        setSlotsError('We couldn’t load times for that day.');
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    },
    [year, month, timezone],
  );

  const onSelectDay = (day: number) => {
    setSelectedDay(day);
    loadSlots(day);
  };

  const goPrevMonth = () => {
    setSelectedDay(null);
    setSlots([]);
    setMonth((m) => (m === 1 ? 12 : m - 1));
    if (month === 1) setYear((y) => y - 1);
  };
  const goNextMonth = () => {
    setSelectedDay(null);
    setSlots([]);
    setMonth((m) => (m === 12 ? 1 : m + 1));
    if (month === 12) setYear((y) => y + 1);
  };

  const submitBooking = async (payload: Parameters<typeof $api.demoBooking.createBooking>[0]) => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await $api.demoBooking.createBooking(payload);
      setReference(res.reference);
      setStep('confirmed');
    } catch (error) {
      const err = error as HttpError;
      if (err.status === 409) {
        // slot was taken between selection and submit
        setSubmitError('That time was just taken. Please pick another slot.');
        setStep('pick');
        if (selectedDay) loadSlots(selectedDay);
      } else {
        setSubmitError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const dayLabel =
    selectedDay !== null
      ? `${MONTH_NAMES[month - 1]} ${selectedDay}`
      : undefined;

  return (
    <MarketingLayout
      seo={{
        title: 'Book a SparkPay demo',
        description:
          'Pick a time to see how SparkPay runs Nigerian payroll — salaries, PAYE and statutory remittances — end to end.',
        path: '/book-a-demo',
      }}
    >
      <section className="mkt-section demo-book">
        <div className="mkt-container demo-book__inner">
          {manageToken ? (
            <ManageBooking token={manageToken} />
          ) : step === 'confirmed' && selectedSlot ? (
            <BookingConfirmation
              reference={reference}
              slotIso={selectedSlot}
              timezone={timezone}
              hour12={hour12}
            />
          ) : (
            <>
              <header className="demo-book__head">
                <span className="mkt-eyebrow">BOOK A DEMO</span>
                <h1 className="demo-book__title">
                  See SparkPay run payroll, live.
                </h1>
                <p className="demo-book__lead">
                  Pick a time that works and tell us a little about your team —
                  we&rsquo;ll confirm your 30-minute demo by email.
                </p>
              </header>

              {step === 'pick' && (
                <div className="demo-book__grid">
                  <BookingCalendar
                    year={year}
                    month={month}
                    availableDays={availableDays}
                    selectedDay={selectedDay}
                    loading={loadingDays}
                    canGoPrev={canGoPrev}
                    onSelectDay={onSelectDay}
                    onPrevMonth={goPrevMonth}
                    onNextMonth={goNextMonth}
                  />

                  {selectedDay !== null ? (
                    <SlotList
                      slots={slots}
                      timezone={timezone}
                      hour12={hour12}
                      selected={selectedSlot}
                      loading={loadingSlots}
                      error={slotsError}
                      dayLabel={dayLabel}
                      onSelectSlot={(iso) => {
                        setSelectedSlot(iso);
                        setStep('details');
                      }}
                      onChangeTimezone={setTimezone}
                      onToggleHourFormat={() => setHour12((v) => !v)}
                      onRetry={() => selectedDay && loadSlots(selectedDay)}
                    />
                  ) : (
                    <div className="demo-slots demo-slots--empty">
                      <p className="demo-slots__hint">
                        Select a day to see available times.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {step === 'details' && selectedSlot && (
                <div className="demo-book__details">
                  <p className="demo-book__chosen">
                    {dayLabel} ·{' '}
                    {new Intl.DateTimeFormat('en-GB', {
                      timeZone: timezone,
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12,
                    }).format(new Date(selectedSlot))}{' '}
                    ({timezone.replace(/_/g, ' ')})
                  </p>
                  <BookingForm
                    slotIso={selectedSlot}
                    timezone={timezone}
                    submitting={submitting}
                    error={submitError}
                    onBack={() => setStep('pick')}
                    onSubmit={submitBooking}
                  />
                </div>
              )}

              {submitError && step === 'pick' && (
                <p className="demo-form__error demo-book__banner">{submitError}</p>
              )}
            </>
          )}
        </div>
      </section>
    </MarketingLayout>
  );
};

export default BookADemo;

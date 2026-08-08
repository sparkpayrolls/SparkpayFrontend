import { Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { InputV2, TextArea } from '@/components/Input/Input.component';
import { SelectInput } from '@/components/Input/seletct-input';
import { MarketingButton } from '@/components/ui/marketing-button.component';
import { CreateDemoBookingPayload } from 'src/api/modules/demo-booking.module';

const EMPLOYEE_SIZES = ['0 - 10', '11 - 50', '51 and above'];

const validation = Yup.object().shape({
  name: Yup.string().trim().required('Your name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  phone: Yup.string().trim().min(6, 'Enter a valid phone').required('Phone is required'),
  companyName: Yup.string().trim().required('Company name is required'),
  employeeSize: Yup.string(),
  notes: Yup.string().max(1000, 'Keep notes under 1000 characters'),
  guestEmails: Yup.string().test(
    'emails',
    'One or more guest emails are invalid',
    (value) =>
      !value ||
      value
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean)
        .every((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)),
  ),
});

type FormValues = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  employeeSize: string;
  notes: string;
  guestEmails: string;
  website: string; // honeypot
};

type BookingFormProps = {
  slotIso: string;
  timezone: string;
  submitting?: boolean;
  error?: string;
  onBack(): void;
  onSubmit(_payload: CreateDemoBookingPayload): void;
};

export const BookingForm = (props: BookingFormProps) => {
  const [showGuests, setShowGuests] = useState(false);

  const initialValues: FormValues = {
    name: '',
    email: '',
    phone: '',
    companyName: '',
    employeeSize: '',
    notes: '',
    guestEmails: '',
    website: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validation}
      onSubmit={(values) => {
        const guestEmails = values.guestEmails
          ? values.guestEmails
              .split(',')
              .map((e) => e.trim())
              .filter(Boolean)
          : undefined;

        props.onSubmit({
          name: values.name,
          email: values.email,
          phone: values.phone,
          companyName: values.companyName,
          employeeSize: values.employeeSize || undefined,
          notes: values.notes || undefined,
          guestEmails,
          website: values.website || undefined,
          startTime: props.slotIso,
          timezone: props.timezone,
        });
      }}
    >
      {({
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit} className="demo-form">
          <div className="demo-form__grid">
            <InputV2
              type="text"
              label="Full name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && errors.name}
            />
            <InputV2
              type="email"
              label="Email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
            />
          </div>

          <div className="demo-form__grid">
            <InputV2
              type="tel"
              label="Phone number"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phone && errors.phone}
            />
            <InputV2
              type="text"
              label="Company"
              name="companyName"
              value={values.companyName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.companyName && errors.companyName}
            />
          </div>

          <SelectInput
            label="Team size"
            name="employeeSize"
            placeholder="Select team size"
            value={values.employeeSize}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.employeeSize && errors.employeeSize}
            options={EMPLOYEE_SIZES}
          />

          <TextArea
            label="Anything we should know? (optional)"
            name="notes"
            rows={3}
            value={values.notes}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.notes && errors.notes}
          />

          {showGuests ? (
            <InputV2
              type="text"
              label="Guest emails (comma-separated)"
              name="guestEmails"
              value={values.guestEmails}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.guestEmails && errors.guestEmails}
            />
          ) : (
            <button
              type="button"
              className="demo-form__add-guests"
              onClick={() => setShowGuests(true)}
            >
              + Add guests
            </button>
          )}

          {/* honeypot — hidden from real users */}
          <div className="demo-form__hp" aria-hidden="true">
            <label>
              Website
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={values.website}
                onChange={handleChange}
              />
            </label>
          </div>

          {props.error && <p className="demo-form__error">{props.error}</p>}

          <div className="demo-form__actions">
            <button
              type="button"
              className="demo-form__back"
              onClick={props.onBack}
            >
              ← Back
            </button>
            <MarketingButton type="submit" arrow>
              {props.submitting ? 'Requesting…' : 'Request booking'}
            </MarketingButton>
          </div>
        </form>
      )}
    </Formik>
  );
};

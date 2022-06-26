import { Formik, FormikProps } from 'formik';
import moment from 'moment';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { SalaryAddOn } from 'src/api/types';
import { SalaryAddonValidation } from 'src/helpers/validation';
import { Button } from '../Button/Button.component';
import { DatePicker } from '../Input/date-picker.component';
import { InputV2, TextArea } from '../Input/Input.component';
import { Select } from '../Input/select.component';

type Addon = Pick<
  SalaryAddOn,
  | 'name'
  | 'description'
  | 'amount'
  | 'type'
  | 'frequency'
  | 'payrollCycle'
  | 'startYear'
  | 'dates'
>;

type ICreateAddonForm = {
  id?: string;
  entity: string;
  initialValues?: Partial<Addon>;
  // eslint-disable-next-line no-unused-vars
  onCreate?(addon: SalaryAddOn): any;
};

export const CreateAddonForm = (props: ICreateAddonForm) => {
  const { initialValues, id, entity, onCreate } = props;

  return (
    <Formik
      initialValues={{
        dates: [],
        payrollCycle: '',
        name: '',
        type: '' as any,
        amount: '' as any,
        frequency: '' as any,
        description: '',
        startYear: '' as any,
        ...initialValues,
      }}
      onSubmit={async (values, helpers) => {
        try {
          helpers.setSubmitting(true);
          const payload = {
            name: values.name,
            description: values.description,
            amount: values.amount || 0,
            type: values.type,
            frequency: values.frequency,
            payrollCycle: values.payrollCycle,
            startYear: values.startYear,
            dates: values.dates,
          };
          let addon: SalaryAddOn;
          if (id) {
            addon = await $api.employee.updateSalaryAddon(id, payload);
            toast.success('Changes saved successfully');
          } else {
            addon = await $api.employee.createSalaryAddon(entity, payload);
            toast.success('Addon created successfully');
          }

          if (onCreate) {
            onCreate(addon);
          }
        } catch (error) {
          const httpError = error as HttpError;
          if (httpError.status === 422) {
            helpers.setErrors(httpError.errors);
            return;
          }

          toast.error(httpError.message);
        } finally {
          helpers.setSubmitting(false);
        }
      }}
      validationSchema={SalaryAddonValidation}
    >
      {(props: FormikProps<Addon>) => {
        const {
          values,
          errors,
          touched,
          isSubmitting,
          handleSubmit,
          handleChange,
          handleBlur,
          setValues,
          setTouched,
        } = props;

        const handleDatesChange = (
          value: [moment.Moment, moment.Moment] | null,
        ) => {
          if (!value) {
            setValues({ ...values, dates: [] });
            return;
          }

          let [start, end] = value;
          if (+start.format('DD') > +end.format('DD')) {
            [start, end] = [end, start];
          }
          const period = start;

          setValues({
            ...values,
            dates: [
              {
                month: period.format('MMMM'),
                year: +period.format('YYYY'),
                days: [start.format('DD'), end.format('DD')],
              },
            ],
          });
        };

        return (
          <form action="#" onSubmit={handleSubmit} className="addon-form">
            <InputV2
              label="Name"
              placeholder="Name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              name="name"
              error={touched.name && errors.name}
            />

            <TextArea
              label="Description (optional)"
              placeholder="Description"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.description}
              error={touched.description && errors.description}
              name="description"
            />

            <Select
              label="Type"
              placeholder="Type"
              onChange={(v) => {
                setValues(
                  {
                    ...values,
                    type: v,
                    dates: v === 'prorate' ? [] : values.dates,
                  },
                  true,
                );
              }}
              onBlur={() => setTouched({ ...touched, type: true }, true)}
              value={values.type}
              options={[
                { value: 'bonus', label: 'Bonus' },
                { value: 'deduction', label: 'Deduction' },
                { value: 'prorate', label: 'Prorate' },
              ]}
              error={(touched.type && errors.type) || ''}
            />
            {values.type !== 'prorate' && (
              <InputV2
                label="Amount"
                type="number"
                name="amount"
                placeholder="Amount"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.amount}
                error={touched.amount && errors.amount}
              />
            )}

            <InputV2
              label="Payroll Cycle"
              type="string"
              placeholder="Payroll Cycle"
              value={values.payrollCycle}
              name="payrollCycle"
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.payrollCycle && errors.payrollCycle}
              helper={
                '`all` for all payroll cycles or a positive number from 1 up'
              }
            />

            <Select
              label="Frequency"
              placeholder="Frequency"
              onChange={(v) => {
                setValues({ ...values, frequency: v }, true);
              }}
              onBlur={() => setTouched({ ...touched, frequency: true }, true)}
              value={values.frequency}
              options={[
                { value: 'once', label: 'One Time' },
                { value: 'recurring', label: 'Recurring' },
              ]}
              error={(touched.frequency && errors.frequency) || ''}
            />

            {values.frequency === 'recurring' && (
              <DatePicker
                label="Start Year"
                placeholder="Start Year"
                helper="Addon will start recurring from selected year"
                picker="year"
                onBlur={() => setTouched({ ...touched, startYear: true }, true)}
                // @ts-ignore
                onChange={(v) => setValues({ ...values, startYear: v?.year() })}
                value={
                  values.startYear ? moment().year(values.startYear) : null
                }
                error={(touched.startYear && errors.startYear) || ''}
              />
            )}

            {values.type !== 'prorate' && (
              <DatePicker.Multiple
                label="Months"
                placeholder="Months"
                onlyMonthPicker
                multiple
                // @ts-ignore
                value={values.dates.map((date) => {
                  if (values.frequency === 'recurring') {
                    const currentYear = moment().year();

                    return moment()
                      .month(date.month)
                      .year(
                        values.startYear && values.startYear > currentYear
                          ? values.startYear
                          : currentYear,
                      )
                      .toDate();
                  }
                  if (!date.year) return null;

                  return moment().month(date.month).year(date.year).toDate();
                })}
                onChange={(v) => {
                  if (!v) {
                    setValues({ ...values, dates: [] });
                    return;
                  }

                  const dates = (Array.isArray(v) ? v : [v]).map((d) => {
                    const date = d as moment.Moment;

                    return {
                      month: date.format('MMMM'),
                      year: +date.format('YYYY'),
                    };
                  });
                  setValues({ ...values, dates });
                }}
                onBlur={() => setTouched({ ...touched, dates: [] })}
                error={touched.dates && errors.dates && 'Months is required'}
              />
            )}

            {values.type === 'prorate' && (
              <DatePicker.RangePicker
                label="Dates"
                onBlur={() => setTouched({ ...touched, dates: [] }, true)}
                // @ts-ignore
                value={
                  values.dates.map((date) => {
                    const start = (date.days || [])[0];
                    const end = (date.days || [])[1];
                    if (!date.year) return [null, null];

                    const format = moment()
                      .month(date.month)
                      .year(date.year)
                      .format('YYYY-MM-');

                    return [
                      +start ? moment(`${format}${start}`) : null,
                      +end ? moment(`${format}${end}`) : null,
                    ];
                  })[0]
                }
                onChange={handleDatesChange as any}
                error={touched.dates && errors.dates && 'Dates are required'}
              />
            )}

            <Button
              type="submit"
              label={id ? 'Save Addon' : 'Create Addon'}
              showSpinner={isSubmitting}
              disabled={isSubmitting}
              primary
            />
          </form>
        );
      }}
    </Formik>
  );
};

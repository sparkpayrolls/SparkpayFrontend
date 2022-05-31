import { FormikProps } from 'formik';
import moment from 'moment';
import { ChangeEvent } from 'react';
import { ICreatePayrollPayload } from 'src/api/types';

export const useCreatePayrollFormContext = () => {
  return (
    props: FormikProps<ICreatePayrollPayload>,
    setParams: (_vals: Record<string, unknown>) => unknown,
    thisMoment: moment.Moment,
  ) => {
    const { setValues, setTouched, values, touched } = props;

    const proRateMonth = thisMoment
      .clone()
      .month(values.proRateMonth)
      .year(values.year || thisMoment.year());
    const handleCycleChange = (event: ChangeEvent<HTMLInputElement>) => {
      setValues({
        ...values,
        cycle: +event.target.value || ('' as any),
      });
      setParams({ cycle: +event.target.value || 0 });
    };
    const handleProRateMonthChange = (value: unknown | null) => {
      const val = value as moment.Moment | null;
      setValues({
        ...values,
        proRateMonth: val?.format('MMMM') || '',
        year: val?.year() || NaN,
      });
      if (val) {
        setParams({
          ...values,
          proRateMonth: val.format('MMMM'),
          year: val.year(),
        });
      }
    };
    const handleProRateMonthBlur = () => {
      setTouched({ ...touched, proRateMonth: true, year: true }, true);
    };
    const handlePayDateChange = (value: unknown | null) => {
      const val = value as moment.Moment | null;
      setValues({
        ...values,
        payDate: val?.toISOString() || '',
      });
    };

    return {
      proRateMonth,
      handleCycleChange,
      handleProRateMonthBlur,
      handlePayDateChange,
      handleProRateMonthChange,
    };
  };
};

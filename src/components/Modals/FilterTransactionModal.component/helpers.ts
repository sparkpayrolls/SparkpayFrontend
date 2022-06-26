import { NiceModalHandler } from '@ebay/nice-modal-react';
import { FormikProps } from 'formik';
import { IFilterTransactionModal } from './types';

export const useLogic = (props: IFilterTransactionModal) => {
  const { initialParams = {}, filter } = props;
  const initialValues = {
    transactionMethod: 'all',
    createdAt: [],
    period: 'all-time',
    ...initialParams,
  };

  const getFormSubmitHandler = (modal: NiceModalHandler) => {
    return (values: typeof initialValues) => {
      if (filter) {
        filter(values);
      }
      modal.hide();
    };
  };

  const getFormContext = (props: FormikProps<typeof initialValues>) => {
    const { values, setValues } = props;
    const getSelectChangeHandler = (name: keyof typeof values) => {
      return (value: string) => {
        setValues({ ...values, [name]: value });
      };
    };
    const getDatePickerChangeHandler = () => {
      return (_: unknown, dateString: string | string[]) => {
        let _dateString = dateString as string[];
        if (!Array.isArray(dateString)) {
          _dateString = [dateString];
        }

        setValues({ ...values, createdAt: _dateString });
      };
    };
    const handleResetButtonClick = (event: { preventDefault: () => void }) => {
      event.preventDefault();
      setValues({
        transactionMethod: 'all',
        createdAt: [],
        period: 'all-time',
      });
    };
    const transactionMethodOptions = [
      { label: 'All', value: 'all' },
      { label: 'Bank', value: 'bank' },
      { label: 'Card', value: 'card' },
      { label: 'Balance', value: 'balance' },
    ];
    const periodOptions = [
      { label: 'All time', value: 'all-time' },
      { label: 'Specific day', value: 'specific-date' },
      { label: 'Custom period', value: 'date-range' },
    ];

    return {
      periodOptions,
      ...props,
      transactionMethodOptions,
      getDatePickerChangeHandler,
      getSelectChangeHandler,
      handleResetButtonClick,
    };
  };

  return { initialValues, getFormContext, getFormSubmitHandler };
};

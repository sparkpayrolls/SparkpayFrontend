import NiceModal from '@ebay/nice-modal-react';
import { Formik } from 'formik';
import moment from 'moment';
import { ModalLayout } from '../ModalLayout.component';
import { Select } from '../../Input/select.component';
import { DatePicker } from '../../Input/date-picker.component';
import { Button } from '../../Button/Button.component';
import { useLogic } from './helpers';
import { IF } from '@/components/Misc/if.component';
import { IFilterTransactionModal } from './types';

export const FilterTransactionModal = NiceModal.create(
  (props: IFilterTransactionModal) => {
    const { initialValues, getFormContext, getFormSubmitHandler } = useLogic(
      props,
    );

    return (
      <ModalLayout title="Filters">
        {(modal) => {
          return (
            <Formik
              initialValues={initialValues}
              onSubmit={getFormSubmitHandler(modal)}
            >
              {(props) => {
                const {
                  periodOptions,
                  transactionMethodOptions,
                  values,
                  getDatePickerChangeHandler,
                  getSelectChangeHandler,
                  handleSubmit,
                  handleResetButtonClick,
                } = getFormContext(props);
                const { createdAt } = values;

                return (
                  <form
                    onSubmit={handleSubmit}
                    className="grid"
                    style={{ gap: '1.5rem' }}
                  >
                    <Select
                      options={transactionMethodOptions}
                      value={values.transactionMethod}
                      onChange={getSelectChangeHandler('transactionMethod')}
                      label="Transaction Method"
                    />

                    <Select
                      options={periodOptions}
                      value={values.period}
                      onChange={getSelectChangeHandler('period')}
                      label="Date Period"
                    />

                    <IF condition={values.period === 'specific-date'}>
                      <DatePicker
                        label="Choose Date"
                        placeholder="Choose Date"
                        value={moment(createdAt[0])}
                        onChange={getDatePickerChangeHandler()}
                      />
                    </IF>

                    <IF condition={values.period === 'date-range'}>
                      <DatePicker.RangePicker
                        label="Choose Range"
                        value={
                          [moment(createdAt[0]), moment(createdAt[1])] as any
                        }
                        onChange={getDatePickerChangeHandler()}
                      />
                    </IF>

                    <div className="buttons d-flex gap">
                      <Button
                        label="Reset"
                        type="submit"
                        onClick={handleResetButtonClick}
                      />

                      <Button label="Apply filters" type="submit" primary />
                    </div>
                  </form>
                );
              }}
            </Formik>
          );
        }}
      </ModalLayout>
    );
  },
);

NiceModal.register('filter-transaction-modal', FilterTransactionModal);

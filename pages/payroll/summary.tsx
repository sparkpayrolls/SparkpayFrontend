import type { NextPage } from 'next';
import { Button } from '../../src/components/Button/Button.component';
import { DatePicker } from '@/components/Input/date-picker.component';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import { WalletBalanceChip } from '@/components/WalletBalanceChip/wallet-balance-chip.component';
import { Formik } from 'formik';
import moment from 'moment';
import { Util } from 'src/helpers/util';
import { IF } from '@/components/Misc/if.component';
import { Spinner } from '@/components/Spinner/Spinner.component';
import { savePayrollValidationSchema } from 'src/helpers/validation';
import withAuth from 'src/helpers/HOC/withAuth';
import { InputV2 } from '@/components/Input/Input.component';
import { useCreatePayrollFormContext } from 'src/helpers/hooks/use-payroll-create-form-context';
import { usePayrollSummaryPageLogic } from 'src/helpers/hooks/use-payroll-summary-page-logic.hook';

const PayrollSummaryPage: NextPage = () => {
  const {
    createUrl,
    formRef,
    loadingSummary,
    walletBalance,
    loadingWalletBalance,
    currency,
    summary,
    params,
    getCreatePayrollFormHandler,
    getSaveClickHandler,
    setParams,
  } = usePayrollSummaryPageLogic();
  const getFormContext = useCreatePayrollFormContext();
  const thisMoment = moment();

  return (
    <DashboardLayoutV2 title="Payroll Summary" href={createUrl}>
      <div className="payroll-summary">
        <div className="payroll-summary__button">
          <Button
            onClick={getSaveClickHandler()}
            disabled={loadingSummary || formRef.current?.disabled}
            showSpinner={formRef.current?.disabled}
            type="button"
            label="Save Payroll"
            primary
          />
        </div>

        <div className="payroll-summary__main">
          <div className="summary-table">
            <div className="summary-table__row">
              <WalletBalanceChip
                title="Summary"
                balance={walletBalance}
                currency={currency}
                loading={loadingWalletBalance}
              />
            </div>

            <div className="summary-table__row">
              <div className="summary-table__row__item">
                <span className="summary-table__row__item__title">
                  Payroll Size
                </span>
                <span className="summary-table__row__item__value">
                  <IF condition={loadingSummary}>
                    <Spinner size={16} color="--green" />
                  </IF>
                  <IF condition={!loadingSummary}>
                    {Util.formatNumber(summary?.payrollSize || 0)}
                  </IF>
                </span>
              </div>
            </div>

            <div className="summary-table__row">
              <div className="summary-table__row__item">
                <span className="summary-table__row__item__title">
                  Total Salaries
                </span>
                <span className="summary-table__row__item__value">
                  <IF condition={loadingSummary}>
                    <Spinner size={16} color="--green" />
                  </IF>
                  <IF condition={!loadingSummary}>
                    {currency}{' '}
                    {Util.formatMoneyNumber(summary?.totalSalaries || 0)}
                  </IF>
                </span>
              </div>
            </div>

            <div className="summary-table__row">
              <div className="summary-table__row__item">
                <span className="summary-table__row__item__title">
                  Total Net Salaries
                </span>
                <span className="summary-table__row__item__value">
                  <IF condition={loadingSummary}>
                    <Spinner size={16} color="--green" />
                  </IF>
                  <IF condition={!loadingSummary}>
                    {currency}{' '}
                    {Util.formatMoneyNumber(summary?.totalNetSalaries || 0)}
                  </IF>
                </span>
              </div>
            </div>

            {summary?.items?.map((item) => {
              return (
                <div key={item.name} className="summary-table__row">
                  <div className="summary-table__row__item">
                    <span className="summary-table__row__item__title">
                      {item.name}
                    </span>
                    <span className="summary-table__row__item__value">
                      <IF condition={loadingSummary}>
                        <Spinner size={16} color="--green" />
                      </IF>
                      <IF condition={!loadingSummary}>
                        {currency} {Util.formatMoneyNumber(item.value)}
                      </IF>
                    </span>
                  </div>
                </div>
              );
            })}

            <div className="summary-table__row">
              <div className="summary-table__row__item">
                <span className="summary-table__row__item__title">Fee</span>
                <span className="summary-table__row__item__value">
                  <IF condition={loadingSummary}>
                    <Spinner size={16} color="--green" />
                  </IF>
                  <IF condition={!loadingSummary}>
                    {currency} {Util.formatMoneyNumber(summary?.fee || 0)}
                  </IF>
                </span>
              </div>
            </div>

            <div className="summary-table__row">
              <div className="summary-table__row__item summary-table__row__item--large">
                <span className="summary-table__row__item__title summary-table__row__item--large__title">
                  Total Payroll Cost
                </span>
                <span className="summary-table__row__item__value summary-table__row__item--large__value">
                  <IF condition={loadingSummary}>
                    <Spinner size={16} color="--green" />
                  </IF>
                  <IF condition={!loadingSummary}>
                    {currency}{' '}
                    {Util.formatMoneyNumber(summary?.totalAmount || 0)}
                  </IF>
                </span>
              </div>
            </div>
          </div>
          <Formik
            initialValues={{
              ...params,
              payDate: '',
            }}
            validationSchema={savePayrollValidationSchema}
            onSubmit={getCreatePayrollFormHandler()}
          >
            {(props) => {
              const {
                handleSubmit,
                handleBlur,
                values,
                errors,
                touched,
                isSubmitting,
              } = props;

              const {
                proRateMonth,
                handleCycleChange,
                handleProRateMonthBlur,
                handlePayDateChange,
                handleProRateMonthChange,
              } = getFormContext(props, setParams, thisMoment);

              return (
                <form onSubmit={handleSubmit} className="payroll-summary__form">
                  <div className="payroll-summary__form__header">
                    <p className="payroll-summary__form__header__title">
                      Set Paydate
                    </p>
                    <p className="payroll-summary__form__header__sub-title">
                      Enter date for salary to be disbursed
                    </p>
                  </div>

                  <div className="payroll-summary__form__input">
                    <InputV2
                      label="Cycle"
                      placeholder="Cycle"
                      defaultValue={values.cycle}
                      type="number"
                      onChange={handleCycleChange}
                      onBlur={handleBlur}
                      name="cycle"
                      disabled={isSubmitting}
                      error={touched.cycle && errors.cycle}
                    />
                  </div>

                  <div className="payroll-summary__form__input">
                    <DatePicker
                      label="Prorate Month"
                      placeholder="Prorate Month"
                      format={'MMMM/YYYY'}
                      defaultValue={proRateMonth}
                      picker="month"
                      disabled={isSubmitting}
                      onChange={handleProRateMonthChange}
                      onBlur={handleProRateMonthBlur}
                      error={
                        (touched.proRateMonth && errors.proRateMonth) ||
                        (touched.year && errors.year) ||
                        ''
                      }
                    />
                  </div>

                  <div className="payroll-summary__form__input">
                    <DatePicker
                      label="Pay Date"
                      placeholder="Pay Date"
                      name="payDate"
                      format={'DD/MMMM/YYYY'}
                      disabled={isSubmitting}
                      onChange={handlePayDateChange}
                      onBlur={handleBlur}
                      error={(touched.payDate && errors.payDate) || ''}
                    />
                  </div>

                  <input
                    type="submit"
                    disabled={isSubmitting}
                    value="submit"
                    hidden
                    ref={formRef}
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </DashboardLayoutV2>
  );
};

export default withAuth(PayrollSummaryPage, ['Payroll', 'write']);

import type { NextPage } from 'next';
import { Button } from '../../src/components/Button/Button.component';
import { DatePicker } from '@/components/Input/date-picker.component';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import { WalletBalanceChip } from '@/components/WalletBalanceChip/wallet-balance-chip.component';
import { Formik } from 'formik';
import moment from 'moment';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PayrollSummary, ProcessPayrollPayload } from 'src/api/types';
import { $api } from 'src/api';
import { useAppSelector } from 'src/redux/hooks';
import { Util } from 'src/helpers/util';
import { IF } from '@/components/Misc/if.component';
import { Spinner } from '@/components/Spinner/Spinner.component';
import { useRouter } from 'next/router';
import { savePayrollValidationSchema } from 'src/helpers/validation';
import { HttpError } from 'src/api/repo/http.error';
import { toast } from 'react-toastify';
import { stringifyUrl } from 'query-string';
import { Label } from '@/components/Shared/label.component';
import { Select } from 'antd';
import { InputError } from '@/components/Shared/input-error.component';

const PayrollSummaryPage: NextPage = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const router = useRouter();
  const formRef = useRef<HTMLInputElement>(null);
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [apiCalls, setApiCalls] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);

  const excludedEmployeeIds = Util.getQueryArrayValue(router.query.exclude);
  const loading = apiCalls > 0;
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const createUrl = stringifyUrl({
    url: '/payroll/create',
    query: { exclude: excludedEmployeeIds },
  });

  const getCompanyWallet = useCallback(async () => {
    try {
      setApiCalls((c) => c + 1);
      const wallet = await $api.payroll.getCompanyWallet();

      setWalletBalance(wallet.balance);
    } catch (error) {
      // ...
    } finally {
      setApiCalls((c) => c - 1);
    }
  }, [setWalletBalance]);

  const getSummary = useCallback(
    async (payload: ProcessPayrollPayload) => {
      try {
        setApiCalls((c) => c + 1);
        const summary = await $api.payroll.getSummary(payload);

        setSummary(summary);
      } catch (error) {
        // ...
      } finally {
        setApiCalls((c) => c - 1);
      }
    },
    [setSummary],
  );

  useEffect(() => {
    const excludedEmployeeIds = Util.getQueryArrayValue(router.query.exclude);
    getCompanyWallet();
    getSummary({
      excludedEmployeeIds,
      proRateMonth: moment().format('MMMM'),
    });
  }, [getCompanyWallet, getSummary, router, administrator]);

  return (
    <DashboardLayoutV2 title="Payroll Summary" href={createUrl}>
      <div className="payroll-summary">
        <div className="payroll-summary__button">
          <Button
            onClick={() => {
              const submit = formRef.current;
              if (submit) {
                submit.click();
              }
            }}
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
                loading={loading && walletBalance <= 0}
              />
            </div>

            <div className="summary-table__row">
              <div className="summary-table__row__item">
                <span className="summary-table__row__item__title">
                  Payroll Size
                </span>
                <span className="summary-table__row__item__value">
                  <IF condition={loading}>
                    <Spinner color="--green" />
                  </IF>
                  <IF condition={!loading}>
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
                  <IF condition={loading}>
                    <Spinner color="--green" />
                  </IF>
                  <IF condition={!loading}>
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
                  <IF condition={loading}>
                    <Spinner color="--green" />
                  </IF>
                  <IF condition={!loading}>
                    {currency}{' '}
                    {Util.formatMoneyNumber(summary?.totalNetSalaries || 0)}
                  </IF>
                </span>
              </div>
            </div>

            <div className="summary-table__row">
              <div className="summary-table__row__item">
                <span className="summary-table__row__item__title">
                  Total Bonuses
                </span>
                <span className="summary-table__row__item__value">
                  <IF condition={loading}>
                    <Spinner color="--green" />
                  </IF>
                  <IF condition={!loading}>
                    {currency}{' '}
                    {Util.formatMoneyNumber(summary?.totalBonus || 0)}
                  </IF>
                </span>
              </div>
            </div>

            <div className="summary-table__row">
              <div className="summary-table__row__item">
                <span className="summary-table__row__item__title">
                  Total Deductions
                </span>
                <span className="summary-table__row__item__value">
                  <IF condition={loading}>
                    <Spinner color="--green" />
                  </IF>
                  <IF condition={!loading}>
                    {currency}{' '}
                    {Util.formatMoneyNumber(summary?.totalDeduction || 0)}
                  </IF>
                </span>
              </div>
            </div>

            <div className="summary-table__row">
              <div className="summary-table__row__item">
                <span className="summary-table__row__item__title">Fee</span>
                <span className="summary-table__row__item__value">
                  <IF condition={loading}>
                    <Spinner color="--green" />
                  </IF>
                  <IF condition={!loading}>
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
                  <IF condition={loading}>
                    <Spinner color="--green" />
                  </IF>
                  <IF condition={!loading}>
                    {currency}{' '}
                    {Util.formatMoneyNumber(summary?.totalAmount || 0)}
                  </IF>
                </span>
              </div>
            </div>
          </div>

          <Formik
            initialValues={{
              proRateMonth: moment().format('MMMM'),
              payDate: '',
            }}
            validationSchema={savePayrollValidationSchema}
            onSubmit={async (values, helpers) => {
              try {
                helpers.setSubmitting(true);
                const payroll = await $api.payroll.createPayroll({
                  ...values,
                  excludedEmployeeIds,
                });
                toast.success(`payroll created - ${payroll.id}`);
                router.push(`/payroll/${payroll.id}`);
              } catch (error) {
                const err = error as HttpError;
                if (err.status === 422) {
                  helpers.setErrors(err.errors);
                  return;
                }
                toast.error(`${err.message}`);
              } finally {
                helpers.setSubmitting(false);
              }
            }}
          >
            {(props) => {
              const {
                handleSubmit,
                isSubmitting,
                handleBlur,
                setValues,
                setTouched,
                values,
                errors,
                touched,
              } = props;

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
                    <DatePicker
                      label="Pay Date"
                      disabled={loading || isSubmitting}
                      loading={loading || isSubmitting}
                      placeholder="Pay Date"
                      name="payDate"
                      onChange={(val) => {
                        setValues({
                          ...values,
                          payDate: val?.toISOString() || '',
                        });
                      }}
                      onBlur={handleBlur}
                      error={(touched.payDate && errors.payDate) || ''}
                    />
                  </div>

                  <div className="payroll-summary__form__input">
                    <Label htmlFor="proratemonth">Prorate Month</Label>
                    <Select
                      id="proratemonth"
                      className={
                        (touched.proRateMonth &&
                          !!errors.proRateMonth &&
                          'has-error') ||
                        ''
                      }
                      onBlur={() =>
                        setTouched({ ...touched, proRateMonth: true }, true)
                      }
                      onChange={(val: string) =>
                        setValues({ ...values, proRateMonth: val }, true)
                      }
                      optionFilterProp="children"
                      placeholder="Select Prorate Month"
                      showSearch
                      loading={loading || isSubmitting}
                      defaultValue={values.proRateMonth}
                    >
                      {Util.prorateMonths().map((month) => {
                        const { Option } = Select;

                        return (
                          <Option value={month} key={month}>
                            {month}
                          </Option>
                        );
                      })}
                    </Select>
                    <InputError>
                      {touched.proRateMonth && errors.proRateMonth}
                    </InputError>
                  </div>

                  <input type="submit" value="submit" hidden ref={formRef} />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </DashboardLayoutV2>
  );
};

export default PayrollSummaryPage;

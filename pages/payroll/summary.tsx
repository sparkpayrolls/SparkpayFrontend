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
import withAuth from 'src/helpers/HOC/withAuth';
import useApiCall from 'src/helpers/hooks/useapicall.hook';
import { InputV2 } from '@/components/Input/Input.component';

const PayrollSummaryPage: NextPage = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const router = useRouter();
  const formRef = useRef<HTMLInputElement>(null);
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [loading, startLoading, endLoading] = useApiCall();
  const [walletBalance, setWalletBalance] = useState(0);
  const [params, setParams] = useState<ProcessPayrollPayload>({
    cycle: 0,
    year: NaN,
    excludedEmployeeIds: [],
    proRateMonth: moment().format('MMMM'),
  });

  const getCompanyWallet = useCallback(async () => {
    try {
      startLoading();
      const wallet = await $api.payroll.getCompanyWallet();

      setWalletBalance(wallet.balance);
    } catch (error) {
      // ...
    } finally {
      endLoading();
    }
  }, [startLoading, endLoading]);

  const getSummary = useCallback(async () => {
    if (isNaN(params.year)) return;
    try {
      startLoading();
      const summary = await $api.payroll.getSummary(params);

      setSummary(summary);
    } catch (error) {
      // ...
    } finally {
      endLoading();
    }
  }, [endLoading, params, startLoading]);

  useEffect(() => {
    getCompanyWallet();
  }, [getCompanyWallet, administrator]);

  useEffect(() => {
    getSummary();
  }, [getSummary, administrator]);

  useEffect(() => {
    if (router.isReady) {
      const query: Record<string, any> = {
        excludedEmployeeIds: Util.getQueryArrayValue(
          router.query.excludedEmployeeIds,
        ),
        year: 0,
        proRateMonth: moment()
          .month(`${router.query.proRateMonth}`)
          .format('MMMM'),
      };
      if (Number(router.query.cycle) >= 1) {
        query.cycle = Number(router.query.cycle);
      }
      if (Number(router.query.year) >= 1) {
        query.year = Number(router.query.year);
      }
      setParams((params) => ({ ...params, ...query }));
    }
  }, [router]);

  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const createUrl = stringifyUrl({
    url: '/payroll/create',
    query: params,
  });

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
            disabled={loading}
            showSpinner={loading}
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
                    <Spinner size={16} color="--green" />
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
                    <Spinner size={16} color="--green" />
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
                    <Spinner size={16} color="--green" />
                  </IF>
                  <IF condition={!loading}>
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
                      <IF condition={loading}>
                        <Spinner size={16} color="--green" />
                      </IF>
                      <IF condition={!loading}>
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
                  <IF condition={loading}>
                    <Spinner size={16} color="--green" />
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
                    <Spinner size={16} color="--green" />
                  </IF>
                  <IF condition={!loading}>
                    {currency}{' '}
                    {Util.formatMoneyNumber(summary?.totalAmount || 0)}
                  </IF>
                </span>
              </div>
            </div>
          </div>
          {(params.year && (
            <Formik
              initialValues={{
                ...params,
                payDate: '',
              }}
              validationSchema={savePayrollValidationSchema}
              onSubmit={async (values, helpers) => {
                if (loading) return;
                try {
                  startLoading();
                  const payroll = await $api.payroll.createPayroll(values);
                  toast.success(`payroll created - ${payroll.id}`);
                  router.push(`/payroll/${payroll.id}`);
                } catch (error) {
                  const err = error as HttpError;
                  if (err.status === 422) {
                    helpers.setErrors(err.errors);
                    return;
                  }
                  toast.error(err.message);
                  endLoading();
                }
              }}
            >
              {(props) => {
                const {
                  handleSubmit,
                  handleBlur,
                  setValues,
                  setTouched,
                  values,
                  errors,
                  touched,
                } = props;

                return (
                  <form
                    onSubmit={handleSubmit}
                    className="payroll-summary__form"
                  >
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
                        value={values.cycle}
                        type="number"
                        onChange={(event) => {
                          setValues({
                            ...values,
                            cycle: +event.target.value || ('' as any),
                          });
                          setParams({
                            ...params,
                            cycle: +event.target.value || 0,
                          });
                        }}
                        onBlur={handleBlur}
                        name="cycle"
                        error={touched.cycle && errors.cycle}
                      />
                    </div>

                    <div className="payroll-summary__form__input">
                      <DatePicker
                        label="Prorate Month"
                        placeholder="Prorate Month"
                        name="payDate"
                        format={'MMMM/YYYY'}
                        value={
                          (values.proRateMonth &&
                            moment()
                              .month(values.proRateMonth)
                              .year(values.year)) ||
                          null
                        }
                        picker="month"
                        onChange={(val) => {
                          setValues({
                            ...values,
                            proRateMonth: val?.format('MMMM') || '',
                            year: val?.year() || NaN,
                          });
                          if (val) {
                            setParams({
                              ...params,
                              proRateMonth: val.format('MMMM'),
                              year: val.year(),
                            });
                          }
                        }}
                        onBlur={() =>
                          setTouched(
                            { ...touched, proRateMonth: true, year: true },
                            true,
                          )
                        }
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

                    <input type="submit" value="submit" hidden ref={formRef} />
                  </form>
                );
              }}
            </Formik>
          )) ||
            ''}
        </div>
      </div>
    </DashboardLayoutV2>
  );
};

export default withAuth(PayrollSummaryPage, ['Payroll', 'write']);

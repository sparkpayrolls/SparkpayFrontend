import { FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { ICreatePayrollPayload } from 'src/api/types';
import { useAppSelector } from 'src/redux/hooks';
import { Util } from '../util';
import { useWalletBalance } from './use-wallet-balance.hook';
import moment from 'moment';
import { PayrollProcessor } from '../payroll-processor/payroll-processor';
import { useProcessorData } from './use-create-payroll-page-logic.hook';

export const usePayrollSummaryPageLogic = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const router = useRouter();
  const formRef = useRef<HTMLInputElement>(null);
  const { walletBalance, loading: loadingWalletBalance } = useWalletBalance();
  const [params, setParams] = useState({
    proRateMonth: moment().format('MMMM'),
    year: moment().year(),
    checked: [] as string[],
    isReady: false,
  });
  const { processorData, loading: loadingPayroll } = useProcessorData(params);
  const [updates, setUpdates] = useState<Record<string, any>>({});

  const { isReady, query } = router;

  useEffect(() => {
    try {
      const inflated = Util.inflate(
        (Util.decodePayload(
          query.params?.toString() || '',
        ) as unknown) as string,
      );

      if (inflated.params) {
        setParams((p) => ({ ...p, ...inflated.params, isReady: true }));
      }

      if (inflated.updates) {
        setUpdates(inflated.updates);
      }
    } catch (error) {
      //...
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  useEffect(() => {
    router.replace(
      `${router.pathname}?params=${Util.signPayload(
        Util.deflate({ params, updates }),
      )}`,
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, updates]);

  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const deflated = Util.signPayload(Util.deflate({ params, updates }));
  const createUrl = `/payroll/create?params=${deflated}`;
  const payroll: ReturnType<typeof PayrollProcessor.process> =
    processorData &&
    PayrollProcessor.process({
      ...processorData,
      employees: processorData.employees.map((e: any) => ({
        ...e,
        excludeFromTotals: !params.checked.includes(e.id),
        salary: updates[e.id]?.salary || e.salary,
        bonus: e.bonus
          .concat(updates[e.id]?.bonus || [])
          .filter(
            (_: any, i: number) => !updates[e.id]?.deletedBonus?.includes(i),
          ),
        deductions: e.deductions
          .concat(updates[e.id]?.deductions || [])
          .filter(
            (_: any, i: number) =>
              !updates[e.id]?.deletedDeduction?.includes(i),
          ),
        prorate:
          'prorate' in (updates[e.id] || {})
            ? updates[e.id].prorate
            : e.prorate,
      })),
    });

  const getCreatePayrollFormHandler = () => {
    return async (
      values: ICreatePayrollPayload,
      helpers: FormikHelpers<ICreatePayrollPayload>,
    ) => {
      try {
        helpers.setSubmitting(true);
        const _updates: any[] = [];

        Object.entries(updates).forEach(([employee, update]) => {
          const emp = processorData.employees.find(
            (e: any) => e.id === employee,
          );
          const _update: Record<string, any> = { employee };
          const deletedAddons: any = [];
          const newAddons: any = [];
          if (update.salary) {
            _update.salary = update.salary;
          }
          if ('prorate' in update) {
            _update.prorate = update.prorate;
          }
          if (update.deletedBonus?.length) {
            emp.bonus
              .concat(update.bonus || [])
              .forEach((b: any, i: number) => {
                if (update.deletedBonus.includes(i) && b.meta) {
                  deletedAddons.push(b.meta.id);
                }
              });
          }
          if (update.deletedDeduction?.length) {
            emp.deductions
              .concat(update.deductions || [])
              .forEach((b: any, i: number) => {
                if (update.deletedDeduction.includes(i) && b.meta) {
                  deletedAddons.push(b.meta.id);
                }
              });
          }
          if (update.bonus?.length) {
            emp.bonus.concat(update.bonus).forEach((b: any, i: number) => {
              if (!update.deletedBonus?.includes(i) && !b.meta) {
                newAddons.push({ ...b, type: 'bonus' });
              }
            });
          }
          if (update.deductions?.length) {
            emp.deductions
              .concat(update.deductions)
              .forEach((b: any, i: number) => {
                if (!update.deletedDeduction?.includes(i) && !b.meta) {
                  newAddons.push({ ...b, type: 'deduction' });
                }
              });
          }

          _update.deletedAddons = deletedAddons;
          _update.newAddons = newAddons;

          _updates.push(_update);
        });

        const payroll = await $api.payroll.createPayroll({
          ...values,
          updates: _updates,
        });
        toast.success('payroll created');
        if (walletBalance < (payroll.totalAmount || 0)) {
          router.push('/transactions');
          return;
        }
        router.push(`/payroll/${payroll.id}`);
      } catch (error) {
        Util.onNonAuthError(error, (err) => {
          if (err.status === 422) {
            helpers.setErrors(err.errors);
            return;
          }
          toast.error(err.message);
          helpers.setSubmitting(false);
        });
      }
    };
  };

  const getSaveClickHandler = () => {
    return () => {
      const submit = formRef.current;
      if (submit) {
        submit.click();
      }
    };
  };

  return {
    walletBalance,
    loadingWalletBalance,
    currency,
    createUrl,
    payroll,
    loadingPayroll,
    formRef,
    params,
    setParams: (vals: Record<string, unknown>) =>
      setParams((p) => ({ ...p, ...vals })),
    getCreatePayrollFormHandler,
    getSaveClickHandler,
  };
};

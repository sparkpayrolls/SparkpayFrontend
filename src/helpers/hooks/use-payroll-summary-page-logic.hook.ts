import { FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { useAppSelector } from 'src/redux/hooks';
import { Util } from '../util';
import { useWalletBalance } from './use-wallet-balance.hook';
import moment from 'moment';
import { PayrollProcessor } from '../payroll-processor/payroll-processor';
import { useProcessorData } from './use-create-payroll-page-logic.hook';
import pick from 'lodash/pick';

export const usePayrollSummaryPageLogic = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const router = useRouter();
  const formRef = useRef<HTMLInputElement>(null);
  const { walletBalance, loading: loadingWalletBalance } = useWalletBalance();
  const [params, setParams] = useState({
    proRateMonth: moment().format('MMMM'),
    year: moment().year(),
    cycles: 1,
    currentCycle: 1,
    checked: [] as string[],
    isReady: false,
  });
  const [payItems, setPayItems] = useState<Record<string, boolean>>({});
  const { processorData, loading: loadingPayroll } = useProcessorData(params);
  const [updates, setUpdates] = useState<Record<string, any>>({});

  const { isReady, query } = router;

  const urlSelectionRef = useRef<{
    selectAll?: boolean;
    excluded?: string[];
    checked?: string[];
  } | null>(null);

  useEffect(() => {
    try {
      const inflated = Util.inflate(
        (Util.decodePayload(
          query.params?.toString() || '',
        ) as unknown) as string,
      );

      if (inflated.params) {
        const {
          checked,
          selectAll,
          excluded,
          ...rest
        } = inflated.params as {
          checked?: string[];
          selectAll?: boolean;
          excluded?: string[];
        } & Record<string, unknown>;
        urlSelectionRef.current = { checked, selectAll, excluded };
        setParams((p) => ({ ...p, ...rest, isReady: true }));
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
    const employees = processorData?.employees as { id: string }[] | undefined;
    if (!employees?.length || !urlSelectionRef.current) return;
    const stored = urlSelectionRef.current;
    urlSelectionRef.current = null;
    const allIds = employees.map((e) => e.id);
    let checked = stored.checked || [];
    if (stored.selectAll) {
      checked = allIds;
    } else if (Array.isArray(stored.excluded)) {
      const excluded = new Set(stored.excluded);
      checked = allIds.filter((id) => !excluded.has(id));
    }
    setParams((p) => ({ ...p, checked }));
  }, [processorData?.employees]);

  useEffect(() => {
    if (!params.isReady) return;
    const { checked, ...rest } = params;
    const employees = (processorData?.employees || []) as { id: string }[];
    const allIds = employees.map((e) => e.id);
    let selection: Record<string, unknown> = { checked };
    if (allIds.length && checked.length === allIds.length) {
      selection = { selectAll: true };
    } else if (
      allIds.length &&
      checked.length > 0 &&
      checked.length > allIds.length / 2
    ) {
      const checkedSet = new Set(checked);
      selection = {
        excluded: allIds.filter((id) => !checkedSet.has(id)),
      };
    }
    const deflated = Util.deflate({
      params: { ...rest, ...selection },
      updates,
    });
    const current = query.params
      ? (Util.decodePayload(query.params.toString()) as unknown)
      : null;
    if (typeof current === 'string' && current === deflated) return;
    router.replace(
      `${router.pathname}?params=${Util.signPayload(deflated)}`,
      undefined,
      { shallow: true },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, updates, processorData?.employees]);

  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const allIds = ((processorData?.employees || []) as { id: string }[]).map(
    (e) => e.id,
  );
  const urlSelection =
    allIds.length && params.checked.length === allIds.length
      ? { selectAll: true }
      : { checked: params.checked };
  const deflated = Util.signPayload(
    Util.deflate({
      params: {
        ...pick(params, ['year', 'proRateMonth', 'cycles', 'currentCycle']),
        ...urlSelection,
      },
      updates,
    }),
  );
  const createUrl = `/payroll/create?params=${deflated}`;
  const checkedSet = useMemo(
    () => new Set(params.checked),
    [params.checked],
  );
  const payroll: ReturnType<typeof PayrollProcessor.process> = useMemo(() => {
    if (!processorData) return null as any;
    return PayrollProcessor.process({
      ...processorData,
      cycles: params.cycles || 1,
      currentCycle: params.currentCycle || 1,
      employees: processorData.employees.map((e: any) => ({
        ...e,
        excludeFromTotals: !checkedSet.has(e.id),
        salary: updates[e.id]?.salary || e.salary,
        ...(updates[e.id]?.netSalary
          ? { netSalary: updates[e.id].netSalary }
          : {}),
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
      payItems,
    });
  }, [
    processorData,
    params.cycles,
    params.currentCycle,
    checkedSet,
    updates,
    payItems,
  ]);
  const initialValues = {
    ...pick(params, ['year', 'proRateMonth', 'cycles', 'currentCycle']),
    employeeIds: params.checked,
    payDate: '',
  };
  const hack = { payroll }; // This is a hack to get the payroll object in the create payroll form handler

  const getCreatePayrollFormHandler = () => {
    return async (
      values: typeof initialValues,
      helpers: FormikHelpers<typeof initialValues>,
    ) => {
      try {
        helpers.setSubmitting(true);
        const _updates: any[] = [];

        Object.entries(updates).forEach(([employee, update]) => {
          const emp = processorData.employees.find(
            (e: any) => e.id === employee,
          );
          const payrollEmployee: any = hack.payroll?.employees?.find((e: any) => e.id === employee);
          const _update: Record<string, any> = { employee };
          const deletedAddons: any = [];
          const newAddons: any = [];
          if (update.salary) {
            _update.salary = update.salary;
          }
          if (update.netSalary && payrollEmployee) {
            _update.salary = payrollEmployee.salary;
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
          payItems,
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

  const summaryItems = [
    {
      name: 'Total Salary',
      value: payroll?.totalSalary,
      sumsTotal: true,
      shouldSum: payItems['salary'] ?? true,
      toggle: () =>
        setPayItems((p) => ({ ...p, salary: !(p['salary'] ?? true) })),
    },
    { name: 'Total Net Salary', value: payroll?.totalNetSalary },
    {
      name: 'Total Bonus',
      value: payroll?.totalBonus,
      sumsTotal: true,
      shouldSum: payItems['bonus'] ?? true,
      toggle: () =>
        setPayItems((p) => ({ ...p, bonus: !(p['bonus'] ?? true) })),
    },
    {
      name: 'Total Deductions',
      value: payroll?.totalDeductions,
    },
    {
      name: 'Total Tax',
      value: payroll?.totalPayrollTax,
      sumsTotal: true,
      shouldSum: payItems['tax'] ?? true,
      toggle: () => setPayItems((p) => ({ ...p, tax: !(p['tax'] ?? true) })),
    },
    {
      name: 'Total Pension',
      value: payroll?.totalPayrollPension,
      sumsTotal: true,
      shouldSum: payItems['pension'] ?? true,
      toggle: () =>
        setPayItems((p) => ({ ...p, pension: !(p['pension'] ?? true) })),
    },
    {
      name: 'Total NHF',
      value: payroll?.totalPayrollNHF,
      sumsTotal: true,
      shouldSum: payItems['nhf'] ?? true,
      toggle: () => setPayItems((p) => ({ ...p, nhf: !(p['nhf'] ?? true) })),
    },
    {
      name: 'Total NSITF',
      value: payroll?.totalPayrollNSITF,
      sumsTotal: true,
      shouldSum: payItems['nsitf'] ?? true,
      toggle: () =>
        setPayItems((p) => ({ ...p, nsitf: !(p['nsitf'] ?? true) })),
    },
    {
      name: 'Total NHIS',
      value: payroll?.totalPayrollNHIS,
      sumsTotal: true,
      shouldSum: payItems['nhis'] ?? true,
      toggle: () => setPayItems((p) => ({ ...p, nhis: !(p['nhis'] ?? true) })),
    },
    { name: 'Total Fee', value: payroll?.totalFees },
  ];

  return {
    walletBalance,
    loadingWalletBalance,
    currency,
    createUrl,
    payroll,
    loadingPayroll,
    formRef,
    params,
    initialValues,
    summaryItems,
    setParams: (vals: Record<string, unknown>) =>
      setParams((p) => ({ ...p, ...vals })),
    getCreatePayrollFormHandler,
    getSaveClickHandler,
  };
};

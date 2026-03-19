import { EditPayrollEmployeeModal } from '@/components/Modals/EditPayrollEmployeeModal.component';
import NiceModal from '@ebay/nice-modal-react';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { $api } from 'src/api';
import { PayrollProcessor } from '../payroll-processor/payroll-processor';
import { useWalletBalance } from './use-wallet-balance.hook';
import { useAppSelector } from 'src/redux/hooks';
import { Util } from '../util';
import pick from 'lodash.pick';
import { useRouter } from 'next/router';

export const useProcessorData = (payload: {
  proRateMonth: string;
  isReady: boolean;
  year: number;
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const { proRateMonth, year, isReady } = payload;

  useEffect(() => {
    if (isReady) {
      setLoading(true);
      $api.payroll
        .getPayrollProcessorData({ proRateMonth, year })
        .then((res) => {
          setData(res);
        })
        .catch(() => {
          // ...
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [proRateMonth, year, isReady]);

  return { processorData: data, loading };
};

export const useCreatePayrollPageLogic = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const { walletBalance, loading: loadingWalletBalance } = useWalletBalance();
  const router = useRouter();
  const [params, setParams] = useState({
    proRateMonth: moment().format('MMMM'),
    year: moment().year(),
    cycles: 1,
    currentCycle: 1,
    checked: [] as string[],
    isReady: false,
  });
  const { processorData, loading: loadingPayroll } = useProcessorData(params);
  const [search, setSearch] = useState('');
  const [updates, setUpdates] = useState<Record<string, any>>({});

  useEffect(() => {
    if (router.isReady && !params.isReady) {
      try {
        const inflated = Util.inflate(
          (Util.decodePayload(
            router.query.params?.toString() || '',
          ) as unknown) as string,
        );

        if (inflated.params) {
          setParams({ ...params, ...inflated.params, isReady: true });
        }

        if (inflated.updates) {
          setUpdates(inflated.updates);
        }
      } catch (error) {
        setParams({ ...params, isReady: true });
      }
    }
  }, [router, params]);

  useEffect(() => {
    const deflated = Util.signPayload(Util.deflate({ params, updates }));
    if (
      (router.query.params || params.checked.length) &&
      router.query.params !== deflated
    ) {
      router.replace(`${router.pathname}?params=${deflated}`);
    }

    if (!router.query.params && processorData?.employees?.length) {
      setParams({
        ...params,
        checked: processorData.employees.map(
          (e: typeof processorData.employees[0]) => e.id,
        ),
      });
    }
  }, [params, updates, router, processorData]);

  const deflated = Util.signPayload(Util.deflate({ params, updates }));
  const summaryUrl = `/payroll/summary?params=${deflated}`;
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const payroll: ReturnType<typeof PayrollProcessor.process> =
    processorData &&
    PayrollProcessor.process({
      ...processorData,
      cycles: params.cycles || 1,
      currentCycle: params.currentCycle || 1,
      employees: processorData.employees.map((e: any) => ({
        ...e,
        excludeFromTotals: !params.checked.includes(e.id),
        salary: updates[e.id]?.salary || e.salary,
        ...(updates[e.id]?.netSalary ? { netSalary: updates[e.id].netSalary } : {}),
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
  const { employees } = processorData || {};

  const handleCheck = (id: string) => {
    return () => {
      if (params.checked.includes(id)) {
        setParams({
          ...params,
          checked: params.checked.filter((c) => c !== id),
        });
        return;
      }

      setParams({ ...params, checked: [...params.checked, id] });
    };
  };

  const handleCheckAll = () => {
    if (params.checked.length === employees.length) {
      setParams({ ...params, checked: [] });
      return;
    }

    setParams({ ...params, checked: employees.map((e: any) => e.id) });
  };

  const handleEmployeeClick = (employee: any) => {
    const emp = employees.find((e: any) => e.id === employee.id);
    return () => {
      NiceModal.show(EditPayrollEmployeeModal, {
        employee,
        currency,
        year: params.year,
        month: params.proRateMonth,
        bonus: emp.bonus
          .concat(updates[employee.id]?.bonus || [])
          .map((_: any, index: number) => ({ ..._, index }))
          .filter(
            (_: any, i: number) =>
              !updates[employee.id]?.deletedBonus?.includes(i),
          ),
        deductions: emp.deductions
          .concat(updates[employee.id]?.deductions || [])
          .map((_: any, index: number) => ({ ..._, index }))
          .filter(
            (_: any, i: number) =>
              !updates[employee.id]?.deletedDeduction?.includes(i),
          ),
        prorate:
          'prorate' in (updates[emp.id] || {})
            ? updates[emp.id].prorate
            : emp.prorate,
        handleUpdates(update: { type: string; payload: any }) {
          switch (update.type) {
            case 'salary': {
              setUpdates((updates) => ({
                ...updates,
                [employee.id]: {
                  ...(updates[employee.id] || {}),
                  salary: update.payload,
                },
              }));
              break;
            }
            case 'netSalary': {
              setUpdates((updates) => ({
                ...updates,
                [employee.id]: {
                  ...(updates[employee.id] || {}),
                  netSalary: update.payload,
                },
              }));
              break;
            }
            case 'delete:Untaxed Bonus':
            case 'delete:Bonus': {
              setUpdates((updates) => ({
                ...updates,
                [employee.id]: {
                  ...(updates[employee.id] || {}),
                  deletedBonus: [
                    ...(updates[employee.id]?.deletedBonus || []),
                    update.payload,
                  ],
                },
              }));
              break;
            }
            case 'delete:Deduction': {
              setUpdates((updates) => ({
                ...updates,
                [employee.id]: {
                  ...(updates[employee.id] || {}),
                  deletedDeduction: [
                    ...(updates[employee.id]?.deletedDeduction || []),
                    update.payload,
                  ],
                },
              }));
              break;
            }
            case 'delete:Prorate': {
              setUpdates((updates) => ({
                ...updates,
                [employee.id]: {
                  ...(updates[employee.id] || {}),
                  prorate: null,
                },
              }));
              break;
            }
            case 'add:Untaxed Bonus':
            case 'add:Bonus': {
              setUpdates((updates) => ({
                ...updates,
                [employee.id]: {
                  ...(updates[employee.id] || {}),
                  bonus: [
                    ...(updates[employee.id]?.bonus || []),
                    pick(update.payload, ['name', 'amount', 'isNotTaxable']),
                  ],
                },
              }));
              break;
            }
            case 'add:Deduction': {
              setUpdates((updates) => ({
                ...updates,
                [employee.id]: {
                  ...(updates[employee.id] || {}),
                  deductions: [
                    ...(updates[employee.id]?.deductions || []),
                    pick(update.payload, ['name', 'amount']),
                  ],
                },
              }));
              break;
            }
            case 'add:Prorate': {
              setUpdates((updates) => ({
                ...updates,
                [employee.id]: {
                  ...(updates[employee.id] || {}),
                  prorate: {
                    startDate: update.payload.startDate.toISOString(),
                    endDate: update.payload.endDate.toISOString(),
                  },
                },
              }));
              break;
            }
          }
        },
        getIndex(type: string) {
          if (['Bonus', 'Untaxed Bonus'].includes(type))
            return emp.bonus.concat(updates[employee.id]?.bonus || []).length;
          return emp.deductions.concat(updates[employee.id]?.deductions || [])
            .length;
        },
      });
    };
  };

  return {
    payroll,
    loadingPayroll,
    walletBalance,
    loadingWalletBalance,
    currency,
    search,
    setSearch,
    summaryUrl,
    hasEmployees: Boolean(payroll?.employees?.length),
    params,
    setParams,
    thisMoment: moment().year(params.year).month(params.proRateMonth),
    allChecked: params.checked.length === payroll?.employees?.length,
    handleCheck,
    handleCheckAll,
    allUnchecked: !params.checked.length,
    handleEmployeeClick,
  };
};

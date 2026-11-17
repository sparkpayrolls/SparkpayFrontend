import { EditPayrollEmployeeModal } from '@/components/Modals/EditPayrollEmployeeModal.component';
import NiceModal from '@ebay/nice-modal-react';
import moment from 'moment';
import { useState, useEffect, useMemo, useRef } from 'react';
import { $api } from 'src/api';
import { PayrollProcessor } from '../payroll-processor/payroll-processor';
import { useWalletBalance } from './use-wallet-balance.hook';
import { useAppSelector } from 'src/redux/hooks';
import { Util } from '../util';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import { useRouter } from 'next/router';

type CreatePayrollParams = {
  proRateMonth: string;
  year: number;
  cycles: number;
  currentCycle: number;
  checked: string[];
  isReady: boolean;
  selectAll?: boolean;
  excluded?: string[];
};

const sameIdSet = (a: string[], b: string[]) => {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  const set = new Set(a);
  return b.every((id) => set.has(id));
};

const toUrlState = (
  params: CreatePayrollParams,
  updates: Record<string, unknown>,
  allEmployeeIds: string[],
) => {
  const { checked } = params;
  const rest = omit(params, [
    'checked',
    'isReady',
    'selectAll',
    'excluded',
  ]) as Omit<
    CreatePayrollParams,
    'checked' | 'isReady' | 'selectAll' | 'excluded'
  >;
  let selection: Partial<CreatePayrollParams> = { checked };

  if (allEmployeeIds.length > 0) {
    if (checked.length === allEmployeeIds.length) {
      selection = { selectAll: true };
    } else if (checked.length === 0) {
      selection = { checked: [] };
    } else if (checked.length > allEmployeeIds.length / 2) {
      const checkedSet = new Set(checked);
      selection = {
        excluded: allEmployeeIds.filter((id) => !checkedSet.has(id)),
      };
    }
  }

  return {
    params: { ...rest, ...selection },
    updates,
  };
};

const resolveChecked = (
  stored: Partial<CreatePayrollParams> | undefined,
  allEmployeeIds: string[],
): string[] | null => {
  if (!stored) return null;
  if (stored.selectAll) return allEmployeeIds;
  if (Array.isArray(stored.excluded) && allEmployeeIds.length) {
    const excluded = new Set(stored.excluded);
    return allEmployeeIds.filter((id) => !excluded.has(id));
  }
  if (Array.isArray(stored.checked)) return stored.checked;
  return null;
};

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
  const [params, setParams] = useState<CreatePayrollParams>({
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
  const lastUrlDeflate = useRef<string | null>(null);
  const pendingUrlSelection = useRef<Partial<CreatePayrollParams> | null>(
    null,
  );
  const selectionHydrated = useRef(false);

  const allEmployeeIds = useMemo(
    () => (processorData?.employees || []).map((e: { id: string }) => e.id),
    [processorData?.employees],
  );

  useEffect(() => {
    if (router.isReady && !params.isReady) {
      try {
        const inflated = Util.inflate(
          (Util.decodePayload(
            router.query.params?.toString() || '',
          ) as unknown) as string,
        );

        if (inflated.params) {
          pendingUrlSelection.current = inflated.params;
          const rest = omit(inflated.params, [
            'checked',
            'selectAll',
            'excluded',
          ]);
          setParams((current) => ({
            ...current,
            ...rest,
            isReady: true,
          }));
        } else {
          setParams((current) => ({ ...current, isReady: true }));
        }

        if (inflated.updates) {
          setUpdates(inflated.updates);
        }
      } catch (error) {
        setParams((current) => ({ ...current, isReady: true }));
      }
    }
  }, [router.isReady, params.isReady, router.query.params]);

  useEffect(() => {
    if (!allEmployeeIds.length) return;

    const fromUrl = resolveChecked(
      pendingUrlSelection.current || undefined,
      allEmployeeIds,
    );
    if (fromUrl) {
      pendingUrlSelection.current = null;
      selectionHydrated.current = true;
      setParams((current) =>
        sameIdSet(current.checked, fromUrl)
          ? current
          : { ...current, checked: fromUrl },
      );
      return;
    }

    if (!router.query.params && params.checked.length === 0) {
      selectionHydrated.current = true;
      setParams((current) => ({
        ...current,
        checked: allEmployeeIds,
      }));
      return;
    }

    selectionHydrated.current = true;
  }, [allEmployeeIds, router.query.params, params.checked.length]);

  useEffect(() => {
    if (!params.isReady || !selectionHydrated.current) return;
    // Avoid writing an empty selection before URL/default selection is applied.
    if (
      params.checked.length === 0 &&
      (pendingUrlSelection.current?.selectAll ||
        pendingUrlSelection.current?.excluded ||
        pendingUrlSelection.current?.checked)
    ) {
      return;
    }

    const urlState = toUrlState(params, updates, allEmployeeIds);
    const deflated = Util.deflate(urlState);
    if (lastUrlDeflate.current === deflated) return;
    if (router.query.params) {
      const current = Util.decodePayload(
        router.query.params.toString(),
      ) as unknown;
      if (typeof current === 'string' && current === deflated) {
        lastUrlDeflate.current = deflated;
        return;
      }
    }

    lastUrlDeflate.current = deflated;
    router.replace(
      `${router.pathname}?params=${Util.signPayload(deflated)}`,
      undefined,
      { shallow: true },
    );
  }, [params, updates, router, allEmployeeIds]);

  const payroll = useMemo(() => {
    if (!processorData) return null;
    const checkedSet = new Set(params.checked);
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
    });
  }, [processorData, params.checked, params.cycles, params.currentCycle, updates]);

  const summaryUrl = useMemo(() => {
    const deflated = Util.signPayload(
      Util.deflate(toUrlState(params, updates, allEmployeeIds)),
    );
    return `/payroll/summary?params=${deflated}`;
  }, [params, updates, allEmployeeIds]);

  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
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

  const handleEmployeeClick = (
    employee: any,
    initialAddonType?: 'Bonus' | 'Deduction',
  ) => {
    const emp = employees.find((e: any) => e.id === employee.id);
    return () => {
      NiceModal.show(EditPayrollEmployeeModal, {
        employee,
        currency,
        year: params.year,
        month: params.proRateMonth,
        initialAddonType,
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

  const handleSelectedIdsChange = (ids: string[]) => {
    setParams((current) =>
      sameIdSet(current.checked, ids)
        ? current
        : { ...current, checked: ids },
    );
  };

  const handleSalaryChange = (id: string, salary: number) => {
    setUpdates((current) => {
      const next = { ...(current[id] || {}), salary };
      delete next.netSalary;
      return { ...current, [id]: next };
    });
  };

  const handleNetSalaryChange = (id: string, netSalary: number) => {
    setUpdates((current) => ({
      ...current,
      [id]: {
        ...(current[id] || {}),
        netSalary,
      },
    }));
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
    handleSelectedIdsChange,
    handleSalaryChange,
    handleNetSalaryChange,
    allUnchecked: !params.checked.length,
    handleEmployeeClick,
  };
};

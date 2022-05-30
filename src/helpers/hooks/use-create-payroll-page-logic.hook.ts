import { EditPayrollEmployeeModal } from '@/components/Modals/EditPayrollEmployeeModal.component';
import NiceModal from '@ebay/nice-modal-react';
import moment from 'antd/node_modules/moment';
import { useState, useRef, useEffect } from 'react';
import { Employee, PayrollEmployee, Addon } from 'src/api/types';
import { useAppSelector } from 'src/redux/hooks';
import { Util } from '../util';
import { usePayrollProcessingParam } from './use-payroll-processing-param.hook';
import { useProcessPayroll } from './use-process-payroll.hook';
import { useWalletBalance } from './use-wallet-balance.hook';

export const useCreatePayrollPageLogic = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const thisMoment = moment();
  const [selected, setSelected] = useState<string[]>([]);
  const modalParamUpdateRef = useRef<{
    id: string;
    setParams: (_params: unknown) => unknown;
  } | null>(null);
  const { walletBalance, loading: loadingWalletBalance } = useWalletBalance();
  const { params, setParams } = usePayrollProcessingParam();
  const {
    payroll,
    loading: loadingPayroll,
    getPayroll,
  } = useProcessPayroll(params, { ignoreExcludedEmployee: true });

  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const employees = payroll?.payrollEmployees || [];
  const { excludedEmployeeIds } = params;
  const signedParams = Util.signPayload(params);
  const summaryUrl = `/payroll/summary?params=${signedParams}`;

  const totals: Record<string, number> = {
    'Total Salary Amount': 0,
    'Total Net Salary': 0,
  };
  const headerRow: string[] = [];
  const remittanceRows: string[] = [];

  employees.forEach((employee) => {
    const isIncluded = !selected.includes((employee.employee as Employee).id);

    if (isIncluded) {
      totals['Total Salary Amount'] += employee.salary;
      totals['Total Net Salary'] += employee.netSalary;
    }
    if (employee.deductions && employee.deductions.length) {
      totals['Total Deductions'] = totals['Total Deductions'] || 0;
      if (isIncluded) {
        totals['Total Deductions'] += Util.sum(
          employee.deductions.map((d) => d.amount),
        );
      }
      if (!headerRow.includes(`Deductions (${currency})`)) {
        headerRow.push(`Deductions (${currency})`);
      }
    }
    if (employee.bonuses && employee.bonuses.length) {
      totals['Total Bonuses'] = totals['Total Bonuses'] || 0;
      if (isIncluded) {
        totals['Total Bonuses'] += Util.sum(
          employee.bonuses.map((d) => d.amount),
        );
      }
      if (!headerRow.includes(`Bonuses (${currency})`)) {
        headerRow.push(`Bonuses (${currency})`);
      }
    }
    if (employee.remittances && employee.remittances.length) {
      employee.remittances.forEach((remittance) => {
        const name = `Total ${remittance.name}`;
        totals[name] = totals[name] || 0;
        if (isIncluded) {
          totals[name] += remittance.amount;
        }
        if (!remittanceRows.includes(`${remittance.name} (${currency})`)) {
          remittanceRows.push(`${remittance.name} (${currency})`);
        }
      });
    }
  });

  const onCheckall = () => {
    let _employees: string[] = [];
    if (selected.length === 0) {
      _employees = employees.map((e) => (e.employee as Employee).id);
    }

    setParams({ excludedEmployeeIds: _employees });
  };

  const onCheck = (id: string) => {
    return () => {
      let _employees: string[] = selected;
      if (_employees.includes(id)) {
        _employees = selected.filter((e: any) => e !== id);
      } else {
        _employees = [...selected, id];
      }

      setParams({ excludedEmployeeIds: _employees });
    };
  };

  const onEmployeeClick = (payrollEmployee: PayrollEmployee) => {
    const employee = payrollEmployee.employee as Employee;
    const name = `${employee.firstname} ${employee.lastname}`;
    const addons = [
      ...(payrollEmployee.bonuses || []),
      ...(payrollEmployee.deductions || []),
    ];
    const modalParams = {
      currency,
      salary: payrollEmployee.salary,
      name,
      employee: employee.id,
      hook: getPayroll,
      addons,
      year: params.year,
      month: params.proRateMonth,
      payrollCycle: params.cycle,
      onCustomAddon(addons: Addon[]) {
        setParams({ addons });
      },
      loadingPayroll,
      remittances: payrollEmployee.remittances || [],
      enabledRemittances: payroll?.enabledRemittances,
    };
    if (modalParamUpdateRef.current?.id === employee.id) {
      modalParamUpdateRef.current.setParams(modalParams);
    }
    return () => {
      NiceModal.show(EditPayrollEmployeeModal, {
        getParams: () => modalParams,
        paramUpdateRef(ref: (_params: unknown) => unknown) {
          if (ref) {
            modalParamUpdateRef.current = {
              id: employee.id,
              setParams: ref,
            };
          } else {
            modalParamUpdateRef.current = null;
          }
        },
      });
    };
  };

  useEffect(() => {
    setSelected(excludedEmployeeIds || []);
  }, [excludedEmployeeIds]);

  return {
    walletBalance,
    loadingWalletBalance,
    onCheckall,
    onCheck,
    payroll,
    employees,
    loadingPayroll,
    currency,
    summaryUrl,
    hasEmployees: !!employees.length,
    allExcluded: employees.length === selected.length,
    headerRow,
    remittanceRows,
    setParams,
    params,
    selected,
    totals,
    thisMoment,
    onEmployeeClick,
  };
};

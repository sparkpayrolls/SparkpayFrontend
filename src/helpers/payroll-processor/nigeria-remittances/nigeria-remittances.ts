import { Util } from '../util';
import { PensionProcessor } from './pension-processor/pension.processor';
import { TaxProcessor } from './tax-processor/tax-processor';
import {
  ProcessPayload,
  Employee,
  SalaryBreakdown,
  StatutoryDeductionOptions,
} from '../types';

export class NigeriaRemittances {
  static process(
    payload: Pick<ProcessPayload, 'precision'> & {
      employee: Employee;
      salaryBreakdown?: SalaryBreakdown;
      proratedSalary: number;
      statutoryDeductionOptions?: Record<string, StatutoryDeductionOptions>;
    },
  ) {
    const {
      employee,
      salaryBreakdown,
      precision,
      proratedSalary,
      statutoryDeductionOptions,
    } = payload;

    const pension = this.processPension({
      employee,
      options: statutoryDeductionOptions?.pension,
      salaryBreakdown,
      precision,
      proratedSalary,
    });
    const nhf = this.processNHF({
      proratedSalary,
      precision,
      options: statutoryDeductionOptions?.nhf,
      employee,
    });
    const tax = this.processTax({
      employee,
      options: statutoryDeductionOptions?.pension,
      precision,
      proratedSalary,
      totalBonus: Util.sumAddons(
        employee.bonus.filter((b) => !b.isNotTaxable),
        precision,
      ),
      pension:
        (pension.employeeContribution || 0) + (pension.voluntaryPension || 0),
      nhf: nhf.amount,
    });

    return {
      remittances: {
        pension,
        nhf,
        tax,
      },
      totalEmployeeDeduction: Util.sum([
        pension.employeeContribution || 0,
        pension.voluntaryPension || 0,
        nhf.amount,
        tax.amount,
      ]),
      salaryBreakdown: Object.entries(
        employee.salaryBreakdown ||
          salaryBreakdown || {
            basic: 100,
            housing: 0,
            transport: 0,
          },
      ).map(([name, value]) => ({
        name,
        value: (proratedSalary * value) / 100,
      })),
      totalRemittances: Util.sum([pension.amount, nhf.amount, tax.amount]),
    };
  }

  private static processPension(payload: {
    employee: Employee;
    options?: StatutoryDeductionOptions;
    salaryBreakdown?: SalaryBreakdown;
    precision: number;
    proratedSalary: number;
  }) {
    const {
      employee,
      options,
      salaryBreakdown,
      precision,
      proratedSalary,
    } = payload;
    const _options = employee.statutoryDeductionOptions?.pension ||
      options || { enabled: false, addToCharge: false };
    const _salaryBreakdown = employee.salaryBreakdown || salaryBreakdown;

    return PensionProcessor.process({
      ..._options,
      salaryBreakdown: _salaryBreakdown,
      precision,
      proratedSalary,
      voluntaryPension: employee.voluntaryPensionContribution,
    });
  }

  private static processTax(payload: {
    employee: Employee;
    options?: StatutoryDeductionOptions;
    precision: number;
    proratedSalary: number;
    totalBonus: number;
    pension: number;
    nhf: number;
  }) {
    const {
      employee,
      options,
      precision,
      proratedSalary,
      totalBonus,
      pension,
      nhf,
    } = payload;
    const _options = employee.statutoryDeductionOptions?.tax ||
      options || { enabled: false, addToCharge: false };

    return TaxProcessor.process({
      ..._options,
      employee,
      precision,
      proratedSalary,
      totalBonus,
      pension,
      nhf,
    });
  }

  private static processNHF(payload: {
    employee: Employee;
    proratedSalary: number;
    precision: number;
    options?: StatutoryDeductionOptions;
  }) {
    const { proratedSalary, precision, options, employee } = payload;
    const { enabled, addToCharge } =
      employee.statutoryDeductionOptions?.nhf || options || {};
    if (!enabled) {
      return {
        amount: 0,
        addToCharge: Boolean(addToCharge),
      };
    }

    return {
      amount: Util.getPreciseNumber(proratedSalary * 0.025, precision),
      addToCharge: Boolean(addToCharge),
    };
  }
}

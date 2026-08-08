import moment from 'moment';
import pick from 'lodash.pick';
import { PensionProcessor } from './pension-processor/pension.processor';
import {
  Addon,
  Employee,
  ProcessedPayroll,
  ProcessPayload,
  SalaryBreakdown,
  StatutoryDeductionOptions,
} from './types';
import { TaxProcessor } from './tax-processor/tax-processor';
import { Util } from '../util';
import { GrossSalaryProcessor } from './gross-salary-processor/gross-salary-processor';
import {
  PercentageStatutoryProcessor,
  STATUTORY_PERCENTAGES,
} from './percentage-statutory-processor/percentage-statutory-processor';
import { merge } from 'lodash';

export class PayrollProcessor {
  private static readonly statutoryTotalKeys = [
    'totalPension',
    'totalNHF',
    'totalNSITF',
    'totalNHIS',
    'totalTax',
    'totalPayrollPension',
    'totalPayrollNHF',
    'totalPayrollNSITF',
    'totalPayrollNHIS',
    'totalPayrollTax',
  ] as const;

  static process(payload: ProcessPayload) {
    const {
      employees,
      precision = 4,
      fees,
      statutoryDeductionOptions,
      salaryBreakdown,
      month,
      year,
      payItems,
      cycles = 1,
      currentCycle = 1,
    } = payload;

    const isFinalCycle = currentCycle >= cycles;

    const shouldSum = (items: string[]) =>
      items.some((item) => payItems?.[item] ?? true);

    const payrollDate = moment().year(year).month(month);
    const workDaysInMonth = Util.calculateWorkDaysBetweenDates(
      payrollDate.startOf('month'),
      payrollDate.clone().endOf('month'),
    );
    const response: ProcessedPayroll = {
      totalSalary: 0,
      totalNetSalary: 0,
      totalBonus: 0,
      totalDeductions: 0,
      totalFees: Util.getPreciseNumber(fees.baseFee, precision),
      totalPension: 0,
      totalNHF: 0,
      totalNSITF: 0,
      totalNHIS: 0,
      totalTax: 0,
      totalPayrollPension: 0,
      totalPayrollNHF: 0,
      totalPayrollNSITF: 0,
      totalPayrollNHIS: 0,
      totalPayrollTax: 0,
      totalCharge: 0,
      employees: [],
    };

    employees.forEach((employee) => {
      const { excludeFromTotals, prorate } = employee;
      let { salary } = employee;
      const totalBonus = this.sumAddons(employee.bonus, precision);
      const totalTaxableBonus = this.sumAddons(
        employee.bonus.filter((b) => !b.isNotTaxable),
        precision,
      );
      const totalDeductions = this.sumAddons(employee.deductions, precision);
      if (employee.netSalary && employee.netSalary > 0) {
        const grossSalary = this.processGrossSalary({
          employee,
          netSalary: employee.netSalary,
          precision,
          salaryBreakdown,
          totalBonus: totalTaxableBonus,
          year,
          statutoryDeductionOptions,
          cycles,
          currentCycle,
        });

        salary = grossSalary.proratedSalary;
      }
      let proratedSalary = salary;
      let prorateDays = 0;
      if (prorate) {
        prorateDays = Util.calculateWorkDaysBetweenDates(
          moment(prorate.startDate),
          moment(prorate.endDate),
        );

        proratedSalary = Util.getPreciseNumber(
          (salary / workDaysInMonth) * prorateDays,
          precision,
        );
      }
      const remittanceGross = Util.getPreciseNumber(
        proratedSalary * cycles,
        precision,
      );
      const disabledRemittance = { amount: 0, addToCharge: false };

      const pension = isFinalCycle
        ? this.processPension({
            employee,
            options: statutoryDeductionOptions?.pension,
            salaryBreakdown,
            precision,
            proratedSalary: remittanceGross,
          })
        : {
            ...disabledRemittance,
            employeeContribution: 0,
            voluntaryPension: 0,
          };
      const nhf = isFinalCycle
        ? PercentageStatutoryProcessor.process({
            proratedSalary: remittanceGross,
            precision,
            percentage: STATUTORY_PERCENTAGES.NHF,
            options: merge(
              { enabled: false, addToCharge: false },
              statutoryDeductionOptions?.nhf,
              employee.statutoryDeductionOptions?.nhf,
            ),
          })
        : disabledRemittance;
      const nsitf = isFinalCycle
        ? PercentageStatutoryProcessor.process({
            proratedSalary: remittanceGross,
            precision,
            percentage: STATUTORY_PERCENTAGES.NSITF,
            options: merge(
              { enabled: false, addToCharge: false },
              statutoryDeductionOptions?.nsitf,
              employee.statutoryDeductionOptions?.nsitf,
            ),
          })
        : disabledRemittance;
      const nhis = isFinalCycle
        ? PercentageStatutoryProcessor.process({
            proratedSalary: remittanceGross,
            precision,
            percentage: STATUTORY_PERCENTAGES.NHIS,
            options: merge(
              { enabled: false, addToCharge: false },
              statutoryDeductionOptions?.nhis,
              employee.statutoryDeductionOptions?.nhis,
            ),
          })
        : disabledRemittance;
      const tax = isFinalCycle
        ? this.processTax({
            employee,
            options: statutoryDeductionOptions?.tax,
            precision,
            proratedSalary: remittanceGross,
            totalBonus: totalTaxableBonus,
            pension:
              (pension.employeeContribution || 0) +
              (pension.voluntaryPension || 0),
            nhf: nhf.amount,
            nhis: nhis.amount,
            year,
          })
        : disabledRemittance;
      const netSalary = Util.getPreciseNumber(
        proratedSalary +
          totalBonus -
          ((pension.employeeContribution || 0) +
            (pension.voluntaryPension || 0)) -
          nhf.amount -
          nhis.amount -
          tax.amount -
          totalDeductions,
        precision,
      );

      response.employees.push({
        ...pick(employee, ['id', 'firstname', 'lastname']),
        totalBonus,
        totalDeductions,
        salary,
        netSalary,
        pension,
        proratedSalary,
        prorateDays,
        tax,
        nhf,
        nsitf,
        nhis,
        excludeFromTotals: Boolean(excludeFromTotals),
        salaryBreakdown: Object.entries(
          employee.salaryBreakdown || salaryBreakdown || {},
        ).map(([name, value]) => ({
          name,
          value: (proratedSalary * value) / 100,
        })),
      });

      if (!excludeFromTotals) {
        const hasRemittance = [nhf, nsitf, nhis, pension, tax].some(
          (r) => r.addToCharge && r.amount > 0,
        );

        response.totalSalary = this.sum(
          precision,
          response.totalSalary,
          salary,
        );
        response.totalNetSalary = this.sum(
          precision,
          response.totalNetSalary,
          netSalary,
        );
        response.totalBonus = this.sum(
          precision,
          response.totalBonus,
          totalBonus,
        );
        response.totalDeductions = this.sum(
          precision,
          response.totalDeductions,
          totalDeductions,
        );
        response.totalFees = this.sum(
          precision,
          response.totalFees,
          shouldSum(['salary', 'bonus']) ? fees.perEmployee : 0,
          hasRemittance && shouldSum(['nhf', 'nsitf', 'nhis', 'pension', 'tax'])
            ? fees.perRemittanceEmployee
            : 0,
        );

        const statutoryTotals: {
          statutory: { amount: number; addToCharge: boolean };
          key: typeof PayrollProcessor.statutoryTotalKeys[number];
          skipCheck?: boolean;
        }[] = [
          { statutory: pension, key: 'totalPension' },
          { statutory: nhf, key: 'totalNHF' },
          { statutory: nsitf, key: 'totalNSITF' },
          { statutory: nhis, key: 'totalNHIS' },
          { statutory: tax, key: 'totalTax' },
          { statutory: pension, key: 'totalPayrollPension', skipCheck: true },
          { statutory: nhf, key: 'totalPayrollNHF', skipCheck: true },
          { statutory: nsitf, key: 'totalPayrollNSITF', skipCheck: true },
          { statutory: nhis, key: 'totalPayrollNHIS', skipCheck: true },
          { statutory: tax, key: 'totalPayrollTax', skipCheck: true },
        ];

        statutoryTotals.forEach(({ statutory, key, skipCheck }) => {
          if (skipCheck || statutory.addToCharge) {
            response[key] = this.sum(
              precision,
              response[key],
              statutory.amount,
            );
          }
        });
      }
    });

    response.totalCharge = this.sum(
      precision,
      shouldSum(['salary']) ? response.totalNetSalary - response.totalBonus : 0,
      shouldSum(['bonus']) ? response.totalBonus : 0,
      response.totalFees,
      shouldSum(['pension']) ? response.totalPension : 0,
      shouldSum(['nhf']) ? response.totalNHF : 0,
      shouldSum(['nsitf']) ? response.totalNSITF : 0,
      shouldSum(['nhis']) ? response.totalNHIS : 0,
      shouldSum(['tax']) ? response.totalTax : 0,
    );

    return response;
  }

  private static processGrossSalary(payload: {
    employee: Employee;
    netSalary: number;
    precision: number;
    salaryBreakdown?: SalaryBreakdown;
    totalBonus: number;
    year: number;
    statutoryDeductionOptions?: Record<
      string,
      StatutoryDeductionOptions | undefined
    >;
    cycles?: number;
    currentCycle?: number;
  }) {
    const {
      employee,
      netSalary,
      precision,
      statutoryDeductionOptions,
      salaryBreakdown,
      totalBonus,
      year,
      cycles = 1,
      currentCycle = 1,
    } = payload;
    const _salaryBreakdown = {
      ...salaryBreakdown,
      ...employee.salaryBreakdown,
    };

    return GrossSalaryProcessor.process({
      netSalary,
      pensionProcessorPayload: {
        ...(employee.statutoryDeductionOptions?.pension ||
          statutoryDeductionOptions?.pension || {
            enabled: false,
            addToCharge: false,
          }),
        salaryBreakdown: _salaryBreakdown,
        precision,
        voluntaryPension: employee.voluntaryPensionContribution,
      },
      employee,
      statutoryDeductionOptions,
      precision,
      taxProcessorPayload: {
        ...(employee.statutoryDeductionOptions?.tax ||
          statutoryDeductionOptions?.tax || {
            enabled: false,
            addToCharge: false,
          }),
        precision,
        totalBonus,
        employee,
        year,
      },
      cycles,
      currentCycle,
    });
  }

  private static processPension(payload: {
    employee: Employee;
    options?: StatutoryDeductionOptions;
    salaryBreakdown?: SalaryBreakdown;
    precision: number;
    proratedSalary: number;
  }) {
    const { employee, options, salaryBreakdown, precision, proratedSalary } =
      payload;
    const _options = merge(
      { enabled: false, addToCharge: false },
      options,
      employee.statutoryDeductionOptions?.pension,
    );
    const _salaryBreakdown = {
      ...salaryBreakdown,
      ...employee.salaryBreakdown,
    };

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
    nhis: number;
    year: number;
  }) {
    const {
      employee,
      options,
      precision,
      proratedSalary,
      totalBonus,
      pension,
      nhf,
      nhis,
      year,
    } = payload;
    const _options = merge(
      { enabled: false, addToCharge: false },
      options,
      employee.statutoryDeductionOptions?.tax,
    );

    return TaxProcessor.process({
      ..._options,
      employee,
      precision,
      proratedSalary,
      totalBonus,
      pension,
      nhf,
      nhis,
      year,
    });
  }

  private static sumAddons(addons: Addon[], precision: number) {
    return Util.getPreciseNumber(
      addons.reduce((acc, cur) => acc + cur.amount, 0),
      precision,
    );
  }

  private static sum(precision: number, ...numbers: number[]) {
    return Util.getPreciseNumber(
      numbers.reduce((acc, cur) => acc + cur, 0),
      precision,
    );
  }
}

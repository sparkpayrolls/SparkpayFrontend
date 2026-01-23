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

export class PayrollProcessor {
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
    } = payload;

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
      totalTax: 0,
      totalPayrollPension: 0,
      totalPayrollNHF: 0,
      totalPayrollTax: 0,
      totalCharge: 0,
      employees: [],
    };

    employees.forEach((employee) => {
      const { excludeFromTotals, prorate } = employee;
      let salary = employee.salary;
      const totalBonus = this.sumAddons(employee.bonus, precision);
      const totalTaxableBonus = this.sumAddons(employee.bonus.filter((b) => !b.isNotTaxable), precision);
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
      const pension = this.processPension({
        employee,
        options: statutoryDeductionOptions?.pension,
        salaryBreakdown,
        precision,
        proratedSalary,
      });
      const nhf = PercentageStatutoryProcessor.process({
        proratedSalary,
        precision,
        percentage: STATUTORY_PERCENTAGES.NHF,
        options: employee.statutoryDeductionOptions?.nhf || statutoryDeductionOptions?.nhf,
      });
      const tax = this.processTax({
        employee,
        options: statutoryDeductionOptions?.pension,
        precision,
        proratedSalary,
        totalBonus: totalTaxableBonus,
        pension:
          (pension.employeeContribution || 0) + (pension.voluntaryPension || 0),
        nhf: nhf.amount,
        year,
      });
      const netSalary = Util.getPreciseNumber(
        proratedSalary +
        totalBonus -
        ((pension.employeeContribution || 0) +
          (pension.voluntaryPension || 0)) -
        nhf.amount -
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
        excludeFromTotals: Boolean(excludeFromTotals),
        salaryBreakdown: Object.entries(
          employee.salaryBreakdown || salaryBreakdown || {},
        ).map(([name, value]) => ({
          name,
          value: (proratedSalary * value) / 100,
        })),
      });

      if (!excludeFromTotals) {
        const hasRemittance = [nhf, pension, tax].some(
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
          hasRemittance && shouldSum(['nhf', 'pension', 'tax'])
            ? fees.perRemittanceEmployee
            : 0,
        );

        [
          { statutory: pension, key: 'totalPension' },
          { statutory: nhf, key: 'totalNHF' },
          { statutory: tax, key: 'totalTax' },
          { statutory: pension, key: 'totalPayrollPension', skipCheck: true },
          { statutory: nhf, key: 'totalPayrollNHF', skipCheck: true },
          { statutory: tax, key: 'totalPayrollTax', skipCheck: true },
        ].forEach(({ statutory, key, skipCheck }) => {
          if (skipCheck || statutory.addToCharge) {
            response[key as 'totalNHF'] = this.sum(
              precision,
              response[key as 'totalNHF'],
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
    statutoryDeductionOptions?: Record<string, StatutoryDeductionOptions | undefined>;
  }) {
    const { employee, netSalary, precision, statutoryDeductionOptions, salaryBreakdown, totalBonus, year } = payload;
    const _salaryBreakdown = Object.assign(
      {},
      salaryBreakdown,
      employee.salaryBreakdown,
    );

    return GrossSalaryProcessor.process({
      netSalary,
      pensionProcessorPayload: {
        ...(employee.statutoryDeductionOptions?.pension || statutoryDeductionOptions?.pension || { enabled: false, addToCharge: false }),
        salaryBreakdown: _salaryBreakdown,
        precision,
        voluntaryPension: employee.voluntaryPensionContribution,
      },
      employee,
      statutoryDeductionOptions,
      precision,
      taxProcessorPayload: { ...(employee.statutoryDeductionOptions?.tax || statutoryDeductionOptions?.tax || { enabled: false, addToCharge: false }), precision, totalBonus, employee, year }
    })
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
    const _salaryBreakdown = Object.assign(
      {},
      salaryBreakdown,
      employee.salaryBreakdown,
    );

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
      year,
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

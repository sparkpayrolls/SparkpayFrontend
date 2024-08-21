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
    } = payload;

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
      totalCharge: 0,
      employees: [],
    };

    employees.forEach((employee) => {
      const { salary, excludeFromTotals, prorate } = employee;
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
      const totalBonus = this.sumAddons(employee.bonus, precision);
      const totalDeductions = this.sumAddons(employee.deductions, precision);
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
      });
      const tax = this.processTax({
        employee,
        options: statutoryDeductionOptions?.pension,
        precision,
        proratedSalary,
        totalBonus,
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
      });

      if (!excludeFromTotals) {
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
          fees.perEmployee,
        );

        [
          { statutory: pension, key: 'totalPension' },
          { statutory: nhf, key: 'totalNHF' },
          { statutory: tax, key: 'totalTax' },
        ].forEach(({ statutory, key }) => {
          if (statutory.addToCharge) {
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
      response.totalNetSalary,
      response.totalFees,
      response.totalPension,
    );

    return response;
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
    });
  }

  private static processTax(payload: {
    employee: Employee;
    options?: StatutoryDeductionOptions;
    precision: number;
    proratedSalary: number;
    totalBonus: number;
  }) {
    const {
      employee,
      options,
      precision,
      proratedSalary,
      totalBonus,
    } = payload;
    const _options = employee.statutoryDeductionOptions?.tax ||
      options || { enabled: false, addToCharge: false };

    return TaxProcessor.process({
      ..._options,
      employee,
      precision,
      proratedSalary,
      totalBonus,
    });
  }

  private static processNHF(payload: {
    proratedSalary: number;
    precision: number;
    options?: StatutoryDeductionOptions;
  }) {
    const { proratedSalary, precision, options } = payload;
    const { enabled, addToCharge } = options || {};
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

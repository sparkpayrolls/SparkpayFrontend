import moment from 'moment';
import { camelCase, merge, pick } from 'lodash';
import {
  Employee,
  ProcessedEmployee,
  ProcessedPayroll,
  ProcessPayload,
} from './types';
import { Util } from './util';
import { NigeriaRemittances } from './nigeria-remittances/nigeria-remittances';

export class PayrollProcessor {
  static process(payload: ProcessPayload) {
    const {
      employees,
      precision = 4,
      feesByCountry,
      month,
      year,
      country,
      conversionRates,
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
      totalFees: Util.getPreciseNumber(
        feesByCountry[country?.iso2]?.baseFee || 0,
        precision,
      ),
      employeesByCountry: {},
      totalCharge: 0,
      payrollTotalsByCountry: {},
      payrollSize: 0,
      currencyCount: 0,
    };
    const baseCurrency = country.currency;

    for (let i = 0; i < employees.length; i += 1) {
      const employee = employees[i];
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

      const totalBonus = Util.sumAddons(employee.bonus, precision);
      const totalDeductions = Util.sumAddons(employee.deductions, precision);
      const remittances = this.processRemittances({
        ...payload,
        employee,
        proratedSalary,
      });
      let netSalary = proratedSalary + totalBonus - totalDeductions;
      if (remittances) {
        netSalary -= remittances.totalEmployeeDeduction;
      }

      netSalary = Util.getPreciseNumber(netSalary, precision);

      const processedEmployee: ProcessedEmployee = merge(
        {
          ...pick(employee, ['id', 'firstname', 'lastname']),
          totalBonus,
          totalDeductions,
          salary,
          netSalary,
          proratedSalary,
          prorateDays,
          excludeFromTotals: Boolean(excludeFromTotals),
          remittances: remittances?.remittances,
        },
        remittances?.remittances,
        pick(remittances, ['salaryBreakdown']),
      );

      const iso2 = employee.country?.iso2 || country?.iso2 || 'NG';
      if (!response.employeesByCountry[iso2]) {
        response.employeesByCountry[iso2] = [];
      }

      response.employeesByCountry[iso2].push(processedEmployee);
      if (!excludeFromTotals) {
        const employeeCurrency = employee.country?.currency || baseCurrency;
        const conversionRate =
          conversionRates[`${baseCurrency}${employeeCurrency}`] || 1;
        const rems = Object.entries(remittances?.remittances || {});
        const hasRemittance =
          rems.length && rems.some(([, r]) => r.addToCharge && r.amount > 0);
        const fees = feesByCountry[iso2];

        if (!response.payrollTotalsByCountry[iso2]) {
          response.payrollTotalsByCountry[iso2] = {
            payrollSize: 0,
            totalSalary: 0,
            totalNetSalary: 0,
            totalBonus: 0,
            totalDeductions: 0,
          };
        }

        response.payrollSize += 1;
        response.payrollTotalsByCountry[iso2].payrollSize += 1;

        response.payrollTotalsByCountry[iso2].totalSalary = this.sum(
          precision,
          response.payrollTotalsByCountry[iso2].totalSalary,
          salary,
        );
        response.totalSalary = this.sum(
          precision,
          response.totalSalary,
          Util.getPreciseNumber(salary / conversionRate, precision),
        );

        response.payrollTotalsByCountry[iso2].totalNetSalary = this.sum(
          precision,
          response.payrollTotalsByCountry[iso2].totalNetSalary,
          netSalary,
        );
        response.totalNetSalary = this.sum(
          precision,
          response.totalNetSalary,
          Util.getPreciseNumber(netSalary / conversionRate, precision),
        );

        response.payrollTotalsByCountry[iso2].totalBonus = this.sum(
          precision,
          response.payrollTotalsByCountry[iso2].totalBonus,
          totalBonus,
        );
        response.totalBonus = this.sum(
          precision,
          response.totalBonus,
          Util.getPreciseNumber(totalBonus / conversionRate, precision),
        );

        response.payrollTotalsByCountry[iso2].totalDeductions = this.sum(
          precision,
          response.payrollTotalsByCountry[iso2].totalDeductions,
          totalDeductions,
        );
        response.totalDeductions = this.sum(
          precision,
          response.totalDeductions,
          Util.getPreciseNumber(totalDeductions / conversionRate, precision),
        );

        response.payrollTotalsByCountry[iso2].totalFees = this.sum(
          precision,
          response.payrollTotalsByCountry[iso2].totalFees,
          fees?.perEmployee || 0,
          hasRemittance ? fees?.perRemittanceEmployee || 0 : 0,
        );
        response.totalFees = this.sum(
          precision,
          response.totalFees,
          Util.getPreciseNumber(
            this.sum(
              precision,
              fees?.perEmployee || 0,
              hasRemittance ? fees?.perRemittanceEmployee || 0 : 0,
            ) / conversionRate,
            precision,
          ),
        );

        for (let j = 0; j < rems.length; j += 1) {
          const [name, statutory] = rems[j];
          if (statutory.addToCharge) {
            const paymentKey = camelCase(`total_${name}`);

            response.payrollTotalsByCountry[iso2][paymentKey] = this.sum(
              precision,
              response.payrollTotalsByCountry[iso2][paymentKey] || 0,
              statutory.amount,
            );

            response.payrollTotalsByCountry[iso2].totalCharge = this.sum(
              precision,
              response.payrollTotalsByCountry[iso2].totalCharge,
              statutory.amount,
            );
            response.totalCharge = this.sum(
              precision,
              response.totalCharge,
              Util.getPreciseNumber(
                statutory.amount / conversionRate,
                precision,
              ),
            );
          }

          const displayKey = camelCase(`total_payroll_${name}`);

          response.payrollTotalsByCountry[iso2][displayKey] = this.sum(
            precision,
            response.payrollTotalsByCountry[iso2][displayKey] || 0,
            statutory.amount,
          );
        }

        response.payrollTotalsByCountry[iso2].totalCharge = this.sum(
          precision,
          response.payrollTotalsByCountry[iso2].totalCharge,
          fees?.perEmployee || 0,
          hasRemittance ? fees?.perRemittanceEmployee || 0 : 0,
          netSalary,
        );
        response.totalCharge = this.sum(
          precision,
          response.totalCharge,
          Util.getPreciseNumber(
            this.sum(
              precision,
              netSalary,
              fees?.perEmployee || 0,
              hasRemittance ? fees?.perRemittanceEmployee || 0 : 0,
            ) / conversionRate,
            precision,
          ),
        );
      }
    }

    response.currencyCount = Object.keys(response.employeesByCountry).length;

    return response;
  }

  private static processRemittances(
    payload: Omit<ProcessPayload, 'employees'> & {
      employee: Employee;
      proratedSalary: number;
    },
  ) {
    switch (payload.employee?.country || payload.country?.iso2) {
      case 'NG': {
        return NigeriaRemittances.process({
          precision: payload.precision,
          employee: payload.employee,
          salaryBreakdown: payload.salaryBreakdownByCountry?.NG,
          proratedSalary: payload.proratedSalary,
          statutoryDeductionOptions: payload.statutoryDeductionsByCountry?.NG,
        });
      }
      default:
        return null;
    }
  }

  private static sum(precision: number, ...numbers: number[]) {
    return Util.getPreciseNumber(
      numbers.reduce((acc, cur) => acc + (cur || 0), 0),
      precision,
    );
  }
}

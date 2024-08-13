import { Util } from 'src/helpers/util';
import { ProcessPayload } from './types';

export class TaxProcessor {
  static process(payload: ProcessPayload) {
    const {
      enabled,
      employee,
      type,
      proratedSalary,
      totalBonus,
      precision,
      withholdingTaxRate = 0.05,
      pension = 0,
      nhf = 0,
      healthRelief = 0,
      addToCharge,
    } = payload;
    if (!enabled || employee.salary <= 3e4) {
      return {
        amount: 0,
        addToCharge: Boolean(addToCharge),
      };
    }

    const grossSalary = Util.getPreciseNumber(
      proratedSalary + totalBonus,
      precision,
    );

    if (type?.toLowerCase() === 'withholding') {
      const taxableSalary = grossSalary;

      return {
        taxRelief: 0,
        taxableSalary,
        amount: Util.getPreciseNumber(
          taxableSalary * withholdingTaxRate,
          precision,
        ),
        isWithholdingTax: true,
        addToCharge: Boolean(addToCharge),
      };
    }

    let firstConsolidatedRelief = Util.getPreciseNumber(
      grossSalary * 0.01,
      precision,
    );
    const secondConsolidatedRelief = Util.getPreciseNumber(
      grossSalary * 0.2,
      precision,
    );
    if (firstConsolidatedRelief < Util.getPreciseNumber(2e5 / 12, precision)) {
      firstConsolidatedRelief = Util.getPreciseNumber(2e5 / 12, precision);
    }

    const taxRelief = Util.getPreciseNumber(
      firstConsolidatedRelief +
        secondConsolidatedRelief +
        nhf +
        pension +
        healthRelief,
      precision,
    );
    const taxableSalary = Util.getPreciseNumber(
      grossSalary - taxRelief,
      precision,
    );

    return {
      isWithholdingTax: false,
      taxRelief,
      taxableSalary,
      amount: this.getTaxAmount(taxableSalary, precision),
      addToCharge: Boolean(addToCharge),
    };
  }

  private static getTaxAmount(taxableSalary: number, precision: number) {
    let amount = 0;
    let _taxableSalary = taxableSalary;

    const bands = [
      { amount: 2.5e4, percent: 0.07 },
      { amount: 2.5e4, percent: 0.11 },
      { amount: 4.1667e4, percent: 0.15 },
      { amount: 4.1667e4, percent: 0.19 },
      { amount: 1.33333e5, percent: 0.21 },
    ];

    for (let i = 0; i < bands.length; i += 1) {
      const band = bands[i];
      if (_taxableSalary > band.amount) {
        _taxableSalary -= band.amount;
        amount = Util.getPreciseNumber(
          amount + band.percent * band.amount,
          precision,
        );
      } else {
        return Util.getPreciseNumber(
          amount + band.percent * _taxableSalary,
          precision,
        );
      }
    }

    return Util.getPreciseNumber(amount + 0.24 * _taxableSalary, precision);
  }
}

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
      nhis = 0,
      healthRelief = 0,
      addToCharge,
      year,
    } = payload;
    if (!enabled || employee.salary <= 7e4) {
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

    const reliefs: number[] = [nhf, nhis, pension, healthRelief]
      .map(Number)
      .filter(Boolean);

    if (year < 2026) {
      const firstConsolidatedRelief = Math.max(
        Util.getPreciseNumber(grossSalary * 0.01, precision),
        Util.getPreciseNumber(2e5 / 12, precision),
      );
      const secondConsolidatedRelief = Util.getPreciseNumber(
        (grossSalary - pension - nhf - nhis) * 0.2,
        precision,
      );
      reliefs.push(firstConsolidatedRelief, secondConsolidatedRelief);
    }

    if (year >= 2026) {
      if (employee.yearlyRentAmount) {
        const amount = employee.yearlyRentAmount / 12;
        const rentReliefPercent = 0.2;
        const maxRentReliefAmount = 5e5 / 12;

        const reliefAmount = Math.min(
          amount * rentReliefPercent,
          maxRentReliefAmount,
        );

        reliefs.push(reliefAmount);
      }
    }

    const taxRelief = Util.getPreciseNumber(Util.sum(reliefs), precision);
    const taxableSalary = Util.getPreciseNumber(
      grossSalary - taxRelief,
      precision,
    );

    return {
      isWithholdingTax: false,
      taxRelief,
      taxableSalary,
      amount: this.getTaxAmount(taxableSalary, precision, year),
      addToCharge: Boolean(addToCharge),
    };
  }

  private static getTaxAmount(
    taxableSalary: number,
    precision: number,
    year: number,
  ) {
    let amount = 0;
    let _taxableSalary = taxableSalary;

    let bands = [
      { amount: 2.5e4, percent: 0.07 },
      { amount: 2.5e4, percent: 0.11 },
      { amount: 4.1667e4, percent: 0.15 },
      { amount: 4.1667e4, percent: 0.19 },
      { amount: 1.33333e5, percent: 0.21 },
      { amount: -Infinity, percent: 0.24 },
    ];

    if (year >= 2026) {
      bands = [
        { amount: 6.6667e4, percent: 0.0 },
        { amount: 1.8333e5, percent: 0.15 },
        { amount: 7.5e5, percent: 0.18 },
        { amount: 1.0833e6, percent: 0.21 },
        { amount: 2.0833e6, percent: 0.23 },
        { amount: -Infinity, percent: 0.25 },
      ];
    }

    for (let i = 0; i < bands.length - 1; i += 1) {
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

    return Util.getPreciseNumber(
      amount + bands[bands.length - 1].percent * _taxableSalary,
      precision,
    );
  }
}

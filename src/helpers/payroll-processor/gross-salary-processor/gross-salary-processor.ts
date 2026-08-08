import { Util } from "src/helpers/util";
import { PensionProcessor } from "../pension-processor/pension.processor";
import { ProcessPayload } from "./types";
import { TaxProcessor } from "../tax-processor/tax-processor";
import {
  PercentageStatutoryProcessor,
  STATUTORY_PERCENTAGES,
} from "../percentage-statutory-processor/percentage-statutory-processor";

export class GrossSalaryProcessor {
  static process(payload: ProcessPayload) {
    const {
      netSalary,
      pensionProcessorPayload,
      statutoryDeductionOptions,
      precision,
      taxProcessorPayload,
      employee,
      cycles = 1,
      currentCycle = 1,
    } = payload;

    const isFinalCycle = currentCycle >= cycles;

    // On non-final cycles no remittances are deducted, so gross = net
    if (!isFinalCycle) {
      const disabledRemittance = { amount: 0, addToCharge: false };
      return {
        tax: disabledRemittance,
        pension: disabledRemittance,
        nhf: disabledRemittance,
        nsitf: disabledRemittance,
        nhis: disabledRemittance,
        proratedSalary: netSalary,
      };
    }

    // Binary search: find proratedSalary where
    // netSalary = proratedSalary - pension(gross) - nhf(gross) - nhis(gross) - tax(gross)
    // where gross = proratedSalary * cycles (nsitf is employer-paid)

    let minProratedSalary = netSalary; // Lower bound: netSalary (no deductions case)
    let maxProratedSalary = netSalary * 3; // Upper bound: reasonable guess
    const tolerance = 10 ** -precision;
    const maxIterations = 100;

    let proratedSalary = minProratedSalary;
    let iterations = 0;
    let bestResult: {
      proratedSalary: number;
      pension: ReturnType<typeof PensionProcessor.process>;
      nhf: ReturnType<typeof PercentageStatutoryProcessor.process>;
      nsitf: ReturnType<typeof PercentageStatutoryProcessor.process>;
      nhis: ReturnType<typeof PercentageStatutoryProcessor.process>;
      tax: ReturnType<typeof TaxProcessor.process>;
    } | null = null;
    let bestDifference = Infinity;

    while (iterations < maxIterations) {
      proratedSalary = Util.getPreciseNumber(
        (minProratedSalary + maxProratedSalary) / 2,
        precision,
      );

      const remittanceGross = Util.getPreciseNumber(
        proratedSalary * cycles,
        precision,
      );

      // Calculate all deductions using forward process methods
      const pension = PensionProcessor.process({
        ...pensionProcessorPayload,
        proratedSalary: remittanceGross,
      });

      const nhf = PercentageStatutoryProcessor.process({
        proratedSalary: remittanceGross,
        precision,
        percentage: STATUTORY_PERCENTAGES.NHF,
        options:
          employee.statutoryDeductionOptions?.nhf ||
          statutoryDeductionOptions?.nhf,
      });
      const nsitf = PercentageStatutoryProcessor.process({
        proratedSalary: remittanceGross,
        precision,
        percentage: STATUTORY_PERCENTAGES.NSITF,
        options:
          employee.statutoryDeductionOptions?.nsitf ||
          statutoryDeductionOptions?.nsitf,
      });
      const nhis = PercentageStatutoryProcessor.process({
        proratedSalary: remittanceGross,
        precision,
        percentage: STATUTORY_PERCENTAGES.NHIS,
        options:
          employee.statutoryDeductionOptions?.nhis ||
          statutoryDeductionOptions?.nhis,
      });

      const tax = TaxProcessor.process({
        ...taxProcessorPayload,
        proratedSalary: remittanceGross,
        pension:
          (pension.employeeContribution || 0) + (pension.voluntaryPension || 0),
        nhf: nhf.amount,
        nhis: nhis.amount,
      });

      const calculatedNetSalary = Util.getPreciseNumber(
        proratedSalary -
          ((pension.employeeContribution || 0) +
            (pension.voluntaryPension || 0)) -
          nhf.amount -
          nhis.amount -
          tax.amount,
        precision,
      );

      const difference = Math.abs(calculatedNetSalary - netSalary);

      // Track the best result so far
      if (difference < bestDifference) {
        bestDifference = difference;
        bestResult = {
          proratedSalary,
          pension,
          nhf,
          nsitf,
          nhis,
          tax,
        };
      }

      if (difference <= tolerance) {
        // Found the solution
        return {
          tax,
          pension,
          nhf,
          nsitf,
          nhis,
          proratedSalary,
        };
      }

      if (calculatedNetSalary < netSalary) {
        // Need higher proratedSalary to get higher netSalary
        minProratedSalary = proratedSalary;
      } else {
        // Need lower proratedSalary to get lower netSalary
        maxProratedSalary = proratedSalary;
      }

      iterations += 1;
    }

    // If we didn't converge, try expanding the search range
    if (iterations >= maxIterations && bestResult) {
      minProratedSalary = netSalary;
      maxProratedSalary = netSalary * 10; // Expand upper bound significantly
      iterations = 0;

      while (iterations < maxIterations) {
        proratedSalary = Util.getPreciseNumber(
          (minProratedSalary + maxProratedSalary) / 2,
          precision,
        );

        const remittanceGross = Util.getPreciseNumber(
          proratedSalary * cycles,
          precision,
        );

        const pension = PensionProcessor.process({
          ...pensionProcessorPayload,
          proratedSalary: remittanceGross,
        });

        const nhf = PercentageStatutoryProcessor.process({
          proratedSalary: remittanceGross,
          precision,
          percentage: STATUTORY_PERCENTAGES.NHF,
          options:
            employee.statutoryDeductionOptions?.nhf ||
            statutoryDeductionOptions?.nhf,
        });
        const nsitf = PercentageStatutoryProcessor.process({
          proratedSalary: remittanceGross,
          precision,
          percentage: STATUTORY_PERCENTAGES.NSITF,
          options:
            employee.statutoryDeductionOptions?.nsitf ||
            statutoryDeductionOptions?.nsitf,
        });
        const nhis = PercentageStatutoryProcessor.process({
          proratedSalary: remittanceGross,
          precision,
          percentage: STATUTORY_PERCENTAGES.NHIS,
          options:
            employee.statutoryDeductionOptions?.nhis ||
            statutoryDeductionOptions?.nhis,
        });

        const tax = TaxProcessor.process({
          ...taxProcessorPayload,
          proratedSalary: remittanceGross,
          pension:
            (pension.employeeContribution || 0) +
            (pension.voluntaryPension || 0),
          nhf: nhf.amount,
          nhis: nhis.amount,
        });

        const calculatedNetSalary = Util.getPreciseNumber(
          proratedSalary -
            ((pension.employeeContribution || 0) +
              (pension.voluntaryPension || 0)) -
            nhf.amount -
            nhis.amount -
            tax.amount,
          precision,
        );

        const difference = Math.abs(calculatedNetSalary - netSalary);

        if (difference < bestDifference) {
          bestDifference = difference;
          bestResult = {
            proratedSalary,
            pension,
            nhf,
            nsitf,
            nhis,
            tax,
          };
        }

        if (difference <= tolerance) {
          return {
            tax,
            pension,
            nhf,
            nsitf,
            nhis,
            proratedSalary,
          };
        }

        if (calculatedNetSalary < netSalary) {
          minProratedSalary = proratedSalary;
        } else {
          maxProratedSalary = proratedSalary;
        }

        iterations += 1;
      }
    }

    // Fallback: return best result found
    if (bestResult) {
      return {
        tax: bestResult.tax,
        pension: bestResult.pension,
        nhf: bestResult.nhf,
        nsitf: bestResult.nsitf,
        nhis: bestResult.nhis,
        proratedSalary: bestResult.proratedSalary,
      };
    }

    // Ultimate fallback: return with netSalary as proratedSalary
    const fallbackRemittanceGross = Util.getPreciseNumber(
      netSalary * cycles,
      precision,
    );
    const pension = PensionProcessor.process({
      ...pensionProcessorPayload,
      proratedSalary: fallbackRemittanceGross,
    });
    const nhf = PercentageStatutoryProcessor.process({
      proratedSalary: fallbackRemittanceGross,
      precision,
      percentage: STATUTORY_PERCENTAGES.NHF,
      options:
        employee.statutoryDeductionOptions?.nhf ||
        statutoryDeductionOptions?.nhf,
    });
    const nsitf = PercentageStatutoryProcessor.process({
      proratedSalary: fallbackRemittanceGross,
      precision,
      percentage: STATUTORY_PERCENTAGES.NSITF,
      options:
        employee.statutoryDeductionOptions?.nsitf ||
        statutoryDeductionOptions?.nsitf,
    });
    const nhis = PercentageStatutoryProcessor.process({
      proratedSalary: fallbackRemittanceGross,
      precision,
      percentage: STATUTORY_PERCENTAGES.NHIS,
      options:
        employee.statutoryDeductionOptions?.nhis ||
        statutoryDeductionOptions?.nhis,
    });
    const tax = TaxProcessor.process({
      ...taxProcessorPayload,
      proratedSalary: fallbackRemittanceGross,
      pension:
        (pension.employeeContribution || 0) + (pension.voluntaryPension || 0),
      nhf: nhf.amount,
      nhis: nhis.amount,
    });

    return {
      tax,
      pension,
      nhf,
      nsitf,
      nhis,
      proratedSalary,
    };
  }
}

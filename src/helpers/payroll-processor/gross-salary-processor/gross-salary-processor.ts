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
    const { netSalary, pensionProcessorPayload, statutoryDeductionOptions, precision, taxProcessorPayload, employee } = payload;

    // Use binary search to find proratedSalary that produces the target netSalary
    // netSalary = proratedSalary - pension(proratedSalary) - nhf(proratedSalary) - tax(proratedSalary, pension, nhf)

    let minProratedSalary = netSalary; // Lower bound: netSalary (no deductions case)
    let maxProratedSalary = netSalary * 3; // Upper bound: reasonable guess
    const tolerance = Math.pow(10, -precision);
    const maxIterations = 100;

    let proratedSalary = minProratedSalary;
    let iterations = 0;
    let bestResult: {
      proratedSalary: number;
      pension: ReturnType<typeof PensionProcessor.process>;
      nhf: ReturnType<typeof PercentageStatutoryProcessor.process>;
      tax: ReturnType<typeof TaxProcessor.process>;
    } | null = null;
    let bestDifference = Infinity;

    while (iterations < maxIterations) {
      proratedSalary = Util.getPreciseNumber(
        (minProratedSalary + maxProratedSalary) / 2,
        precision,
      );

      // Calculate all deductions using forward process methods
      const pension = PensionProcessor.process({
        ...pensionProcessorPayload,
        proratedSalary,
      });

      const nhf = PercentageStatutoryProcessor.process({
        proratedSalary,
        precision,
        percentage: STATUTORY_PERCENTAGES.NHF,
        options: employee.statutoryDeductionOptions?.nhf || statutoryDeductionOptions?.nhf,
      });

      const tax = TaxProcessor.process({
        ...taxProcessorPayload,
        proratedSalary,
        pension: (pension.employeeContribution || 0) + (pension.voluntaryPension || 0),
        nhf: nhf.amount,
      });

      const calculatedNetSalary = Util.getPreciseNumber(
        proratedSalary -
        ((pension.employeeContribution || 0) + (pension.voluntaryPension || 0)) -
        nhf.amount -
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
          tax,
        };
      }

      if (difference <= tolerance) {
        // Found the solution
        return {
          tax,
          pension,
          nhf,
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

        const pension = PensionProcessor.process({
          ...pensionProcessorPayload,
          proratedSalary,
        });

        const nhf = PercentageStatutoryProcessor.process({
          proratedSalary,
          precision,
          percentage: STATUTORY_PERCENTAGES.NHF,
          options: employee.statutoryDeductionOptions?.nhf || statutoryDeductionOptions?.nhf,
        });

        const tax = TaxProcessor.process({
          ...taxProcessorPayload,
          proratedSalary,
          pension: (pension.employeeContribution || 0) + (pension.voluntaryPension || 0),
          nhf: nhf.amount,
        });

        const calculatedNetSalary = Util.getPreciseNumber(
          proratedSalary -
          ((pension.employeeContribution || 0) + (pension.voluntaryPension || 0)) -
          nhf.amount -
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
            tax,
          };
        }

        if (difference <= tolerance) {
          return {
            tax,
            pension,
            nhf,
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
        proratedSalary: bestResult.proratedSalary,
      };
    }

    // Ultimate fallback: return with netSalary as proratedSalary
    const pension = PensionProcessor.process({
      ...pensionProcessorPayload,
      proratedSalary: netSalary,
    });
    const nhf = PercentageStatutoryProcessor.process({
      proratedSalary: netSalary,
      precision,
      percentage: STATUTORY_PERCENTAGES.NHF,
      options: employee.statutoryDeductionOptions?.nhf || statutoryDeductionOptions?.nhf,
    });
    const tax = TaxProcessor.process({
      ...taxProcessorPayload,
      proratedSalary: netSalary,
      pension: (pension.employeeContribution || 0) + (pension.voluntaryPension || 0),
      nhf: nhf.amount,
    });

    return {
      tax,
      pension,
      nhf,
      proratedSalary,
    };
  }

}
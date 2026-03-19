import { Util } from 'src/helpers/util';
import { ProcessPayload, ProcessResult } from './types';

/**
 * Percentage constants for statutory deductions
 */
export const STATUTORY_PERCENTAGES = {
  NHF: 0.025, // 2.5% - National Housing Fund
  NSITF: 0.01, // 1% - Nigeria Social Insurance Trust Fund
  NHIS: 0.05, // 5% - National Health Insurance Scheme
} as const;

export class PercentageStatutoryProcessor {
  /**
   * Process a percentage-based statutory deduction
   * @param payload - Processing payload containing proratedSalary, precision, percentage, and options
   * @returns ProcessResult with amount and addToCharge flag
   */
  static process(payload: ProcessPayload): ProcessResult {
    const { proratedSalary, precision, percentage, options } = payload;
    const { enabled, addToCharge } = options || {};

    if (!enabled) {
      return {
        amount: 0,
        addToCharge: Boolean(addToCharge),
      };
    }

    return {
      amount: Util.getPreciseNumber(proratedSalary * percentage, precision),
      addToCharge: Boolean(addToCharge),
    };
  }
}

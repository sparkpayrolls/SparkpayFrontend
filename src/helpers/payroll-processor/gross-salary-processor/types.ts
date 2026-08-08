import { ProcessPayload as PensionProcessorPayload } from '../pension-processor/types';
import { Employee, StatutoryDeductionOptions } from '../types';
import { ProcessPayload as TaxProcessorPayload } from '../tax-processor/types';

export type ProcessPayload = {
  netSalary: number;
  precision: number;
  employee: Employee;
  pensionProcessorPayload: Omit<PensionProcessorPayload, 'proratedSalary'>;
  statutoryDeductionOptions?: Record<
    string,
    StatutoryDeductionOptions | undefined
  >;
  taxProcessorPayload: Omit<
    TaxProcessorPayload,
    'proratedSalary' | 'nhf' | 'nhis' | 'pension'
  >;
  cycles?: number;
  currentCycle?: number;
};

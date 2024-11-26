import { Util } from '../../util';
import { ProcessPayload } from './types';

export class PensionProcessor {
  static process(payload: ProcessPayload) {
    const {
      type,
      employeePercent = 8,
      employerPercent = 10,
      salaryBreakdown = {},
      voluntaryPension = 0,
      precision,
      addToCharge,
      enabled,
      proratedSalary,
    } = payload;
    if (!enabled) {
      return {
        amount: 0,
        addToCharge: Boolean(addToCharge),
      };
    }

    // eslint-disable-next-line prefer-const
    let { basic = 0, housing = 0, transport = 0 } = salaryBreakdown;
    if (basic + housing + transport <= 0) {
      const total = Object.values(salaryBreakdown).reduce(
        (acc, cur) => acc + cur,
        0,
      );

      basic = Math.max(100 - total, 0);
    }

    const salary = Util.getPreciseNumber(
      proratedSalary * ((basic + housing + transport) / 100),
      precision,
    );
    let employerContribution = Util.getPreciseNumber(
      (salary * employerPercent) / 100,
      precision,
    );
    let employeeContribution = Util.getPreciseNumber(
      (salary * employeePercent) / 100,
      precision,
    );

    if (type === 'quote') {
      employeeContribution = 0;
      employerContribution = Util.getPreciseNumber(
        (salary * employerPercent * 2) / 100,
        precision,
      );
    }

    return {
      amount: Util.getPreciseNumber(
        employeeContribution + employerContribution + voluntaryPension,
        precision,
      ),
      employeeContribution,
      employerContribution,
      voluntaryPension: Util.getPreciseNumber(voluntaryPension, precision),
      type,
      addToCharge: Boolean(addToCharge),
    };
  }
}

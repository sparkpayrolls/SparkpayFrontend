import React, { useEffect, useState } from 'react';
import { PayrollEditSVG } from '../svg';
// import { useCreatePayrollPageLogic } from 'src/helpers/hooks/use-create-payroll-page-logic.hook';
import { ProcessedEmployee } from 'src/helpers/payroll-processor/types';

export type PayrollDropdownProps = {
  currency: string;
  employee: ProcessedEmployee;
  onSalaryChange: (newSalary: number) => void;
};

export const PayrollInput = (props: PayrollDropdownProps) => {
  const { currency, employee, onSalaryChange } = props;
  const [salary, setSalary] = useState('');

  // const { handleEmployeeClick } = useCreatePayrollPageLogic();

  useEffect(() => {
    if (employee?.salary) {
      setSalary(employee.salary.toString());
    }
  }, [employee]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalary(e.target.value);
    const numericValue = parseFloat(e.target.value) || 0;
    onSalaryChange(numericValue);
  };

  return (
    <div className="payroll__input-section">
      <input
        // onClick={() => handleEmployeeClick(employee?.id)}
        type="text"
        className="payroll__input-value"
        value={salary}
        onChange={handleInputChange}
      />
      <div style={{ display: 'flex', gap: '1px' }}>
        <span className="payroll-input__icon mr-4">
          <PayrollEditSVG />
        </span>
      </div>
    </div>
  );
};

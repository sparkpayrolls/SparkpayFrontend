import React, { useState } from 'react';
import { PayrollEditSVG } from '../svg'; // Adjust the import path accordingly
import { IPayrollInput } from '../types';

export const PayrollInput: React.FC<IPayrollInput> = ({ placeholder, value, onChange }) => {
  const [inputValue, setInputValue] = useState(value);

  return (
    <div className='payroll__input-section'>
      <input
        type='text'
        placeholder={placeholder} // Placeholder text if the input is empty
        className='payroll__input-value'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <span className='payroll-input__icon'>
        <PayrollEditSVG />
      </span>
    </div>
  );
};

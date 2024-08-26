import React, { useState } from 'react';
import { PayrollEditSVG } from '../svg';
import { PayrollDeleteSVG } from '../svg';
import { IPayrollInput } from '../types';

export const PayrollInput: React.FC<IPayrollInput> = ({ placeholder, value }) => {
  const [inputValue, setInputValue] = useState(value);

  return (
    <div className='payroll__input-section'>
      <input
        type='number'
        placeholder={placeholder}
        className='payroll__input-value'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div style={{display:'flex', gap:'1px'}}>
      <span className='payroll-input__icon mr-4' >
        <PayrollEditSVG />
      </span>
      </div>
  
    </div>
  );
};



export const PayrollInputEdit: React.FC<IPayrollInput> = ({ placeholder, value }) => {
    const [inputValue, setInputValue] = useState(value);
  
    return (
      <div className='payroll__input-section'>
        <input
          type='number'
          placeholder={placeholder} // Placeholder text if the input is empty
          className='payroll__input-value'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div style={{display:'flex', gap:'1px'}}>
        <span className='payroll-input__icon mr-4' >
          <PayrollEditSVG />
        </span>
        <span className='payroll-input__icon'>
          <PayrollDeleteSVG />
        </span>
        </div>
    
      </div>
    );
  };
import { useState } from 'react';
import { PayrollInput } from '../Input/payroll-input.component';
import { TotalCard } from '@/components/Card/total-card.component';
import { Util } from 'src/helpers/util';
import NiceModal from '@ebay/nice-modal-react';
import { EditPayrollEmployeeModal } from '../Modals/EditPayrollEmployeeModal.component';
import { ProcessedEmployee } from 'src/helpers/payroll-processor/types';
import { PayrollEditSVG } from '../svg';
import { PayrollDeleteSVG } from '../svg';
import moment from 'moment';
export type PayrollDropdownProps = {
  currency: string;
  employee: ProcessedEmployee;
};

const PayrollDropdown = (props: any) => {
  const { currency, employee } = props;
  const [addons, setAddons] = useState<
    { type: string; description: string; amount: string }[]
  >([]);

  const [salary, setSalary] = useState(employee.salary); // Local salary state

  const handleSalaryChange = (newSalary: number) => {
    setSalary(newSalary); // Update salary state
    employee.salary = newSalary; // Also update the employee object
    employee.netSalary =
      newSalary + employee.totalBonus - employee.totalDeductions; // Recalculate net salary
  };

  const onBonusUpdate = (
    updatedAddons: { description: string; amount: string }[],
  ) => {
    let totalBonus = 0;
    let totalDeductions = 0;
    let updatedNetSalary = employee.salary;

    updatedAddons.forEach((addon) => {
      if (addon.description.toLowerCase().includes('bonus')) {
        totalBonus += Number(addon.amount);
        updatedNetSalary += Number(addon.amount);
      } else if (addon.description.toLowerCase().includes('deduction')) {
        totalDeductions += Number(addon.amount);
        updatedNetSalary -= Number(addon.amount);
      }
    });

    // Update employee object with new totals
    employee.totalBonus = totalBonus;
    employee.totalDeductions = totalDeductions;
    employee.netSalary = updatedNetSalary;
  };

  const handleUpdateAddon = (values: any) => {
    const { type, description, amount, startDate, endDate } = values;
    let updatedNetSalary = employee.netSalary;

    if (values.type === 'Bonus') {
      updatedNetSalary += Number(amount);
      employee.totalBonus = (employee.totalBonus || 0) + Number(amount);
    } else if (values.type === 'Deduction') {
      updatedNetSalary -= Number(amount);
      employee.totalDeductions =
        (employee.totalDeductions || 0) + Number(amount);
    } else if (values.type === 'Prorate') {
      const totalDaysInMonth = moment(endDate).daysInMonth();
      const workedDays = moment(endDate).diff(moment(startDate), 'days') + 1;

      const proratedSalary = (employee.salary / totalDaysInMonth) * workedDays;
      employee.proratedSalary = proratedSalary;

      updatedNetSalary =
        proratedSalary + employee.totalBonus - employee.totalDeductions;
    }

    employee.netSalary = updatedNetSalary;
    setAddons((prevAddons) => [...prevAddons, { type, description, amount }]);
  };

  const handleEditAddon = (index: number) => {
    const currentAddon = addons[index];
    NiceModal.show(EditPayrollEmployeeModal, {
      employee,
      currency,
      handleUpdates: (updatedValues: {
        type: string;
        description: string;
        amount: string;
      }) => {
        const updatedAddons = addons.map((addon, i) =>
          i === index ? { ...addon, ...updatedValues } : addon,
        );
        recalculateSalary(updatedAddons);
        setAddons(updatedAddons);
        onBonusUpdate(updatedAddons);
      },
      getIndex: () => index,
      type: currentAddon.type,
      description: currentAddon.description,
      amount: currentAddon.amount,
      isEdit: true,
    });
  };

  const handleDeleteAddon = (index: number) => {
    const filteredAddons = addons.filter((_, i) => i !== index);
    recalculateSalary(filteredAddons);
    setAddons(filteredAddons);
  };

  const recalculateSalary = (
    updatedAddons: { description: string; amount: string }[],
  ) => {
    let newNetSalary = employee.salary;
    let totalBonus = 0;
    let totalDeductions = 0;
    let proratedSalary = employee.salary;

    updatedAddons.forEach((addon) => {
      if (addon.description.toLowerCase().includes('bonus')) {
        newNetSalary += Number(addon.amount);
        totalBonus += Number(addon.amount);
      } else if (addon.description.toLowerCase().includes('deduction')) {
        newNetSalary -= Number(addon.amount);
        totalDeductions += Number(addon.amount);
      } else if (addon.description === 'Prorate') {
        proratedSalary = Number(addon.amount); // Assumes amount is already prorated
        newNetSalary = proratedSalary + totalBonus - totalDeductions;
      }
    });

    // Update employee totals
    employee.netSalary = newNetSalary;
    employee.totalBonus = totalBonus;
    employee.proratedSalary = proratedSalary;
    employee.totalDeductions = totalDeductions;
  };

  return (
    <div className="create-payroll-page">
      <div className="payroll">
        <div className="payroll__content">
          <div className="payroll__pay">
            <h1 className="payroll__input">Monthly Pay </h1>
            <div className="payroll__salary">
              <h1>Salary</h1>
              <PayrollInput
                currency={currency}
                employee={employee}
                salary={salary} // Pass the local salary state
                onSalaryChange={handleSalaryChange}
              />
            </div>
            <div className="payroll__addon">
              <p>Salary Add-Ons</p>
              <p
                className="payroll__addon-add"
                onClick={() => {
                  NiceModal.show(EditPayrollEmployeeModal, {
                    employee,
                    currency,
                    handleUpdates: handleUpdateAddon,
                    getIndex: () => 0,
                    bonus: [],
                    deductions: [],
                    prorate: null,
                    year: new Date().getFullYear(),
                    month: new Date().getMonth(),
                  });
                }}
              >
                Add Salary add-ons
              </p>
            </div>
            <div className="payroll__salar">
              {addons.length > 0 &&
                addons.map((addon, index) => (
                  <div
                    key={index}
                    className="payroll__salary-addon"
                    style={{
                      backgroundColor: 'white',
                      padding: '1.5rem 1rem 1.5rem 1.5rem',
                      borderRadius: '4px',
                      borderBottom: '1px solid #ccc',
                    }}
                  >
                    <div className="payroll__addon-details">
                      <p>{addon.type}</p>
                      <p>{Util.formatMoneyNumber(+addon.amount)}</p>{' '}
                    </div>
                    <div className="payroll__addon-actions">
                      <span
                        className="payroll-input__icon mr-4"
                        onClick={() => handleEditAddon(index)}
                      >
                        <PayrollEditSVG />
                      </span>
                      <span
                        className="payroll-input__icon"
                        onClick={() => handleDeleteAddon(index)}
                      >
                        <PayrollDeleteSVG />
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="create-payroll-page__totals employee-payroll-breakdown">
            <div className="create-payroll-page__totals__items">
              <TotalCard
                title={'Gross Pay'}
                // type="primary"
                value={`${currency} ${Util.formatMoneyNumber(
                  employee?.salary,
                )}`}
              />

              <TotalCard
                title={'Bonus'}
                value={`${currency} ${Util.formatMoneyNumber(
                  employee?.totalBonus,
                )}`}
              />

              <TotalCard
                title={'Prorate'}
                value={`${currency} ${Util.formatMoneyNumber(
                  employee?.proratedSalary,
                )}`}
              />

              <TotalCard
                title={'Employee NC'}
                value={`${currency} ${Util.formatMoneyNumber(
                  employee?.totalDeductions,
                )}`}
              />

              <TotalCard
                title={'PAYE'}
                value={`${currency} ${Util.formatMoneyNumber(
                  employee?.tax?.amount,
                )}`}
              />

              <TotalCard
                title={'Employee Pension'}
                value={`${currency} ${Util.formatMoneyNumber(
                  employee?.pension?.amount,
                )}`}
              />
              <TotalCard
                title={'Net Pay'}
                value={`${currency} ${Util.formatMoneyNumber(
                  employee?.netSalary,
                )}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDropdown;

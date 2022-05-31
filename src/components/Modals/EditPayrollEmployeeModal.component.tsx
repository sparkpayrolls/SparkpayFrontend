import NiceModal from '@ebay/nice-modal-react';
import { Switch } from 'antd';
import { Formik } from 'formik';
import { Addon } from 'src/api/types';
import {
  useEditPayrollEmployeeModalLogic,
  useUpdatePayrollEmployeeAddonFormHandlers,
  IEditPayrollEmployeeModalParams,
} from 'src/helpers/hooks/use-edit-payroll-employee-modal-logic.hook';
import { Util } from 'src/helpers/util';
import {
  SalaryAddonValidation,
  UpdateSalaryValidation,
} from 'src/helpers/validation';
import { Button } from '../Button/Button.component';
import { DatePicker } from '../Input/date-picker.component';
import { InputV2 } from '../Input/Input.component';
import { Select } from '../Input/select.component';
import { ModalLayout } from './ModalLayout.component';

type IEditPayrollEmployeeModal = {
  getParams(): IEditPayrollEmployeeModalParams;
  paramUpdateRef(
    _ref: ((_param: IEditPayrollEmployeeModalParams) => unknown) | null,
  ): unknown;
};

export const EditPayrollEmployeeModal = NiceModal.create(
  (props: IEditPayrollEmployeeModal) => {
    const {
      params,
      addon,
      onEditAddon,
      onDeleteAddon,
      onSubmitAddon,
      onSubmitSalary,
      onToggleRemittance,
      onSelectGroup,
      onClearGroup,
    } = useEditPayrollEmployeeModalLogic(props);
    if (!params) {
      return null;
    }

    const {
      currency,
      salary,
      name,
      employee,
      hook,
      addons,
      payrollCycle,
      year,
      month,
      onCustomAddon,
      loadingPayroll,
      enabledRemittances,
      remittances,
    } = params;

    return (
      <ModalLayout title={name}>
        {() => {
          return (
            <div key={JSON.stringify(params)} className="edit-payroll-employee">
              <div className="edit-payroll-employee__section">
                <h3 className="edit-payroll-employee__section-title">
                  Edit Salary
                </h3>

                <Formik
                  initialValues={{ salary }}
                  onSubmit={onSubmitSalary({ employee, hook })}
                  validationSchema={UpdateSalaryValidation}
                >
                  {(props) => {
                    const {
                      errors,
                      handleChange,
                      handleSubmit,
                      isSubmitting,
                      touched,
                      values,
                    } = props;

                    return (
                      <form onSubmit={handleSubmit}>
                        <InputV2
                          type="number"
                          label={`Salary Amount (${currency})`}
                          placeholder={`Salary Amount (${currency})`}
                          name="salary"
                          value={values.salary}
                          onChange={handleChange}
                          transformValue={Util.formatMoneyString(currency)}
                          disabled={isSubmitting || loadingPayroll}
                          error={touched.salary && errors.salary}
                        />

                        <Button
                          type="submit"
                          disabled={
                            isSubmitting ||
                            values.salary === salary ||
                            loadingPayroll
                          }
                          showSpinner={isSubmitting || loadingPayroll}
                          label="Update Salary"
                          primary
                        />
                      </form>
                    );
                  }}
                </Formik>
              </div>

              <div className="edit-payroll-employee__section">
                <h3 className="edit-payroll-employee__section-title">
                  Add Salary Addon
                </h3>

                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {addons.map((addon, i) => {
                      const [date] = addon.dates;
                      const { month } = date;
                      const [start, end] = date.days || [];
                      const prorateRange = `${start}/${month} -> ${end}/${month}`;
                      const isProrateAddon = addon.type === 'prorate';
                      const amount = `${currency} ${Util.formatMoneyNumber(
                        +addon.amount,
                      )}`;

                      return (
                        <tr key={`${employee}-addon-${i}`}>
                          <td>{addon.type}</td>
                          <td title={isProrateAddon ? amount : ''}>
                            {isProrateAddon ? prorateRange : amount}
                          </td>
                          <td>{addon.name}</td>
                          <td>
                            <button
                              disabled={loadingPayroll}
                              onClick={onEditAddon(addon)}
                            >
                              <i className="fa fa-pencil" aria-hidden="true">
                                &#x270E;
                              </i>
                            </button>
                            <button
                              disabled={loadingPayroll}
                              onClick={onDeleteAddon({
                                addon,
                                addons,
                                hook,
                                onCustomAddon,
                                month,
                                year,
                              })}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <Formik
                  key={JSON.stringify(addon)}
                  initialValues={
                    {
                      type: '',
                      name: '',
                      amount: '',
                      payrollCycle,
                      frequency: 'once',
                      startYear: year,
                      dates: [{ days: [], month, year: year }],
                      ...(addon || {}),
                    } as Addon
                  }
                  onSubmit={onSubmitAddon({
                    onCustomAddon,
                    hook,
                    employee,
                    addons,
                  })}
                  validationSchema={SalaryAddonValidation}
                >
                  {(props) => {
                    const {
                      errors,
                      handleBlur,
                      handleChange,
                      handleSubmit,
                      isSubmitting,
                      setTouched,
                      setValues,
                      touched,
                      values,
                    } = props;
                    const {
                      handleTypeChange,
                      handleDatesChange,
                      prorateDates,
                    } = useUpdatePayrollEmployeeAddonFormHandlers({
                      values,
                      setValues: setValues as any,
                      month,
                      year,
                    });

                    return (
                      <form onSubmit={handleSubmit}>
                        <Select
                          label="Type"
                          placeholder="Type"
                          disabled={isSubmitting}
                          options={[
                            { value: 'bonus', label: 'Bonus' },
                            { value: 'deduction', label: 'Deduction' },
                            { value: 'prorate', label: 'Prorate' },
                          ]}
                          value={values.type}
                          onBlur={() =>
                            setTouched({ ...touched, type: true }, true)
                          }
                          error={(touched.type && errors.type) || ''}
                          onChange={handleTypeChange}
                        />

                        <InputV2
                          label="Name"
                          placeholder="Name"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.name && errors.name}
                          disabled={isSubmitting || loadingPayroll}
                        />

                        {values.type !== 'prorate' && (
                          <InputV2
                            label="Amount"
                            type="number"
                            name="amount"
                            placeholder="Amount"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.amount}
                            error={touched.amount && errors.amount}
                            transformValue={Util.formatMoneyString(currency)}
                            disabled={isSubmitting || loadingPayroll}
                          />
                        )}

                        {values.type === 'prorate' && (
                          <DatePicker.RangePicker
                            disabled={isSubmitting || loadingPayroll}
                            label="Dates"
                            key={Math.random()}
                            onBlur={() =>
                              setTouched({ ...touched, dates: [] }, true)
                            }
                            defaultValue={prorateDates}
                            onChange={handleDatesChange as any}
                            error={
                              (touched.dates &&
                                errors.dates &&
                                'Dates are required') ||
                              ''
                            }
                          />
                        )}

                        <Button
                          type="submit"
                          disabled={isSubmitting || loadingPayroll}
                          label="Save Addon"
                          showSpinner={isSubmitting || loadingPayroll}
                          primary
                        />
                      </form>
                    );
                  }}
                </Formik>
              </div>
              {enabledRemittances.length && (
                <div className="edit-payroll-employee__section">
                  <h3 className="edit-payroll-employee__section-title">
                    Toggle Remittances
                  </h3>

                  <ul>
                    {enabledRemittances.map((enabledRemittance) => {
                      const {
                        name,
                        groups,
                        hasGroupsFeature,
                      } = enabledRemittance;
                      const remittance = remittances.find(
                        (remittance) => remittance.name === name,
                      );

                      return (
                        <li key={name}>
                          <h4 className="edit-payroll-employee__section-sub-title">
                            {name}
                          </h4>

                          <div>
                            <Switch
                              className="organization-menu__dropdown__item__switch"
                              defaultChecked={!!remittance}
                              loading={loadingPayroll}
                              disabled={loadingPayroll}
                              onChange={onToggleRemittance({
                                employee,
                                hook,
                                name,
                              })}
                            />
                            {hasGroupsFeature && (
                              <>
                                <Select
                                  label="Tax Group (optional)"
                                  placeholder="Tax Group (optional)"
                                  disabled={!remittance || loadingPayroll}
                                  options={groups.map((group) => ({
                                    value: group.id,
                                    label: group.name,
                                  }))}
                                  defaultValue={remittance?.groupId}
                                  onChange={onSelectGroup({
                                    employee,
                                    name,
                                    hook,
                                  })}
                                />
                                {remittance?.groupId && (
                                  <button
                                    onClick={onClearGroup({
                                      employee,
                                      hook,
                                      name,
                                      groupId: remittance?.groupId as string,
                                    })}
                                    disabled={loadingPayroll}
                                  >
                                    clear
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          );
        }}
      </ModalLayout>
    );
  },
);

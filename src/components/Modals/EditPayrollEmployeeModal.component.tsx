import { useEffect } from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { Formik } from 'formik';
import { Util } from 'src/helpers/util';
import { PayrollEmployeeAddonValidation } from 'src/helpers/validation';
import { Button } from '../Button/Button.component';
import { DatePicker } from '../Input/date-picker.component';
import { InputV2, TextArea } from '../Input/Input.component';
import { ModalLayout } from './ModalLayout.component';
import moment from 'moment';
import { useState } from 'react';
import { SelectInput } from '../Input/seletct-input';
import { InfoEmployeeSVG } from '../svg';

export const EditPayrollEmployeeModal = NiceModal.create((props: any) => {
  const {
    employee,
    currency,
    handleUpdates,
    prorate,
    type,
    description,
    amount,
    isEdit,
  } = props;

  return (
    <ModalLayout
      key={JSON.stringify(props)}
      title={`Salary Add-On (${employee.firstname} ${employee.lastname})`}
    >
      {() => {
        // const [addons, setAddons] = useState(
        //   bonus
        //     .map((b: any) => ({ ...b, type: 'Bonus' }))
        //     .concat(deductions.map((d: any) => ({ ...d, type: 'Deduction' })))
        //     .concat(
        //       prorate ? [{ type: 'Prorate', name: 'Prorate', ...prorate }] : [],
        //     ),
        // );
        // const [deletedAddons, setDeletedAddons] = useState<number[]>([]);
        const [initialValues, setInitialValues] = useState({
          type: '',
          name: '',
          amount: '',
          description: '',
          startDate: moment()
          .year(new Date().getFullYear())
          .month(new Date().getMonth())
          .startOf('month'),
        endDate: moment()
          .year(new Date().getFullYear())
          .month(new Date().getMonth())
          .endOf('month'),
          isNotTaxable: false,
        });
        // const deleteAddon = (addon: any, index: number) => {
        //   handleUpdates({
        //     type: `delete:${addon.type}`,
        //     payload: addon.index,
        //   });
        //   setDeletedAddons(deletedAddons.concat([index]));
        // };
        useEffect(() => {
          if (isEdit) {
            setInitialValues((prevValues) => ({
              ...prevValues,
              type,
              description,
              amount,
              isNotTaxable: false,
            }));
          }
        }, [isEdit, type, description, amount]);
        return (
          <div className="edit-payroll-employee">
            <div className="edit-payroll-employee__section">
              <p>You can add allowance to your employee’s salary here</p>
              {/* {Boolean(addons.length) && (
                <table className="edit-payroll-employee__table-section">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {addons.map((bonus: any, i: number) => {
                      if (deletedAddons.includes(i)) {
                        return null;
                      }

                      return (
                        <tr key={`${employee}-addon-${bonus.amount}`}>
                          <td>
                            {bonus.isNotTaxable ? 'Untaxed Bonus' : bonus.type}
                          </td>
                          <td>
                            {!bonus.amount
                              ? `${moment(bonus.startDate).format(
                                  'DD',
                                )} --> ${moment(bonus.endDate).format('DD/MM')}`
                              : `${currency} ${Util.formatMoneyNumber(
                                  +bonus.amount,
                                )}`}
                          </td>
                          <td>{bonus.name}</td>
                          <td className="edit-payroll-employee__table-section--actions">
                            <button
                              onClick={() => {
                                deleteAddon(bonus, i);
                                setInitialValues({
                                  ...bonus,
                                  startDate: moment(
                                    bonus.startDate || initialValues.startDate,
                                  ),
                                  endDate: moment(
                                    bonus.endDate || initialValues.endDate,
                                  ),
                                  type: bonus.isNotTaxable
                                    ? 'Untaxed Bonus'
                                    : bonus.type,
                                });
                              }}
                              title="Edit"
                            >
                              <EditableSVG />
                            </button>
                            <button
                              onClick={() => {
                                deleteAddon(bonus, i);
                              }}
                              title="Delete"
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )} */}

              <Formik
                key={JSON.stringify(initialValues)}
                initialValues={initialValues}
                onSubmit={(values, helpers) => {
                  const { type, startDate, endDate } = values;
                  if (values.type === 'Untaxed Bonus') {
                    values.isNotTaxable = true;
                  }   
                   if (type === 'Prorate' && startDate && endDate) {
                    const totalDaysInMonth = moment(endDate).daysInMonth();
                    const workedDays =
                      moment(endDate).diff(moment(startDate), 'days') + 1;

                    const proratedSalary =
                      (employee.salary / totalDaysInMonth) * workedDays;
                    handleUpdates({
                      ...values,
                      amount: proratedSalary.toFixed(2),
                    });
                  } else {
                    handleUpdates(values);
                  }

                  // handleUpdates({
                  //   type: `add:${values.type}`,
                  //   payload: values,
                  // });
                  // setAddons(
                  //   addons.concat({ ...values, index: getIndex(values.type) }),
                  // );
                  helpers.setSubmitting(false);
                  helpers.resetForm();
                  NiceModal.hide(EditPayrollEmployeeModal);
                }}
                //   handleUpdates({
                //     type: `add:${values.type}`,
                //     payload: values,
                //   });
                //   setAddons(
                //     addons.concat({ ...values, index: getIndex(values.type) }),
                //   );
                //   helpers.setSubmitting(false);
                //   setInitialValues({
                //     type: '',
                //     name: '',
                //     amount: '',
                //     description: '',
                //     startDate: moment()
                //       .year(year)
                //       .month(month)
                //       .startOf('month'),
                //     endDate: moment().year(year).month(month),
                //     isNotTaxable: false,
                //   });
                // }}
                validationSchema={PayrollEmployeeAddonValidation}
              >
                {(formikProps) => {
                  const {
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values,
                    resetForm,
                    setValues,
                  } = formikProps;

                  return (
                    <form
                      onSubmit={handleSubmit}
                      className="edit-payroll-employee__form2"
                    >
                      <SelectInput
                        key={JSON.stringify(values)}
                        label="Type"
                        placeholder="Choose the required add-on"
                        loading={isSubmitting}
                        name="type"
                        options={['Bonus', 'Untaxed Bonus', 'Deduction'].concat(
                          prorate ? [] : ['Prorate'],
                        )}
                        value={values.type}
                        onBlur={handleBlur}
                        error={(touched.type && errors.type) || ''}
                        onChange={handleChange}
                      />

                      {values.type !== 'Prorate' && (
                        <>
                          <TextArea
                            label="Description"
                            placeholder="Description"
                            name="description"
                            id="group_description"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={isSubmitting}
                            error={touched.description && errors.description}
                            value={values.description}
                          />

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
                            disabled={isSubmitting}
                          />
                        </>
                      )}

                      {values.type === 'Prorate' && (
                        <>
                          <TextArea
                            label="Description"
                            placeholder="Description"
                            name="description"
                            id="group_description"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={isSubmitting}
                            error={touched.description && errors.description}
                            value={values.description}
                          />
                          <DatePicker.RangePicker
                            disabled={isSubmitting}
                            label="Dates"
                            key={Math.random()}
                            defaultValue={[values.startDate, values.endDate]}
                            onChange={(_values: any) => {
                              if (_values) {
                                setValues({
                                  ...values,
                                  startDate: _values[0],
                                  endDate: _values[1],
                                });
                              }
                            }}
                          />
                        </>
                      )}
                      {values.type === 'Prorate' &&
                        values.startDate &&
                        values.endDate && (
                          <p className="edit-payroll-employee__text">
                            Select the number of days in the month you want to
                            pay this employee, to update their base salary for
                            this payroll.
                          </p>
                        )}

                      <p
                        className="edit-payroll-employee__salarytext"
                        onClick={() => {
                          resetForm(); 
                          setValues({
                            type: '',
                            name: '', 
                            description: '',
                            amount: '',
                            startDate: moment().startOf('month'),
                            endDate: moment().endOf('month'),
                            isNotTaxable:false
                          });
                        }}
                      >
                        Add another add-on
                      </p>

                      {(values.type === 'Bonus' ||
                        values.type === 'Deduction') && (
                        <>
                          <div className="edit-payroll-employee__totalSales">
                            <p>{values.description}:</p>
                            <p>{values?.amount}</p>
                          </div>
                          <div className="edit-payroll-employee__totaltext">
                            <p>Total:</p>
                            <p>{values?.amount}</p>
                          </div>
                        </>
                      )}

                      {values.type === 'Prorate' &&
                        values.startDate &&
                        values.endDate && (
                          <div className="edit-payroll-employee__prorateUpdate">
                            <span>
                              <InfoEmployeeSVG />
                            </span>
                            <p>
                              8 days salary will be paid to this staff this
                              month
                            </p>
                          </div>
                        )}

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        label="Save Addon"
                        showSpinner={isSubmitting}
                        primary
                      />
                    </form>
                  );
                }}
              </Formik>
            </div>
          </div>
        );
      }}
    </ModalLayout>
  );
});

import NiceModal from '@ebay/nice-modal-react';
import { Formik } from 'formik';
import { Util } from 'src/helpers/util';
import {
  PayrollEmployeeAddonValidation,
  UpdateSalaryValidation,
} from 'src/helpers/validation';
import { Button } from '../Button/Button.component';
import { DatePicker } from '../Input/date-picker.component';
import { InputV2 } from '../Input/Input.component';
import { EditableSVG } from '../svg';
import { ModalLayout } from './ModalLayout.component';
import moment from 'moment';
import { useState } from 'react';
import { SelectInput } from '../Input/seletct-input';

export const EditPayrollEmployeeModal = NiceModal.create((props: any) => {
  const {
    employee,
    currency,
    handleUpdates,
    getIndex,
    bonus,
    deductions,
    prorate,
    year,
    month,
  } = props;

  return (
    <ModalLayout
      key={JSON.stringify(props)}
      title={`${employee.firstname} ${employee.lastname}`}
    >
      {() => {
        const [addons, setAddons] = useState(
          bonus
            .map((b: any) => ({ ...b, type: 'Bonus' }))
            .concat(deductions.map((d: any) => ({ ...d, type: 'Deduction' })))
            .concat(
              prorate ? [{ type: 'Prorate', name: 'Prorate', ...prorate }] : [],
            ),
        );
        const [deletedAddons, setDeletedAddons] = useState<number[]>([]);
        const [initialValues, setInitialValues] = useState({
          type: '',
          name: '',
          amount: '',
          startDate: moment().year(year).month(month).startOf('month'),
          endDate: moment().year(year).month(month),
        });
        const deleteAddon = (addon: any, index: number) => {
          handleUpdates({
            type: `delete:${addon.type}`,
            payload: addon.index,
          });
          setDeletedAddons(deletedAddons.concat([index]));
        };

        return (
          <div className="edit-payroll-employee">
            <div className="edit-payroll-employee__section">
              <h3 className="edit-payroll-employee__section-title">
                Edit Salary
              </h3>

              <Formik
                initialValues={{ salary: employee.salary }}
                onSubmit={(values, helpers) => {
                  handleUpdates({ type: 'salary', payload: values.salary });
                  helpers.setSubmitting(false);
                }}
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
                    <form
                      onSubmit={handleSubmit}
                      className="edit-payroll-employee__form"
                    >
                      <InputV2
                        type="number"
                        label={`Salary Amount (${currency})`}
                        placeholder={`Salary Amount (${currency})`}
                        name="salary"
                        value={values.salary}
                        onChange={handleChange}
                        transformValue={Util.formatMoneyString(currency)}
                        disabled={isSubmitting}
                        error={touched.salary && (errors.salary as string)}
                      />

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        showSpinner={isSubmitting}
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

              {Boolean(addons.length) && (
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
                          <td>{bonus.type}</td>
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
              )}

              <Formik
                key={JSON.stringify(initialValues)}
                initialValues={initialValues}
                onSubmit={(values, helpers) => {
                  handleUpdates({
                    type: `add:${values.type}`,
                    payload: values,
                  });
                  setAddons(
                    addons.concat({ ...values, index: getIndex(values.type) }),
                  );
                  helpers.setSubmitting(false);
                  setInitialValues({
                    type: '',
                    name: '',
                    amount: '',
                    startDate: moment()
                      .year(year)
                      .month(month)
                      .startOf('month'),
                    endDate: moment().year(year).month(month),
                  });
                }}
                validationSchema={PayrollEmployeeAddonValidation}
              >
                {(props) => {
                  const {
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values,
                    setValues,
                  } = props;

                  return (
                    <form
                      onSubmit={handleSubmit}
                      className="edit-payroll-employee__form2"
                    >
                      <SelectInput
                        key={JSON.stringify(values)}
                        label="Type"
                        placeholder="Type"
                        loading={isSubmitting}
                        name="type"
                        options={['Bonus', 'Deduction'].concat(
                          prorate ? [] : ['Prorate'],
                        )}
                        value={values.type}
                        onBlur={handleBlur}
                        error={(touched.type && errors.type) || ''}
                        onChange={handleChange}
                      />

                      {values.type !== 'Prorate' && (
                        <>
                          <InputV2
                            label="Name"
                            placeholder="Name"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.name && errors.name}
                            disabled={isSubmitting}
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

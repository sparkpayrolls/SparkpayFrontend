import { Button } from '@/components/Button/Button.component';
import { EditableField } from '@/components/Input/editable-field.component';
import { PlusSvg } from '@/components/svg';
import { FieldArray, Form } from 'formik';
import { useEmployeeFormContext } from './hooks';
import { PayoutDetailFields } from './payout-details-fields.component/payout-detail-fileds.component';
import { EmployeesFormProps } from './types';

export const EmployeesForm = (props: EmployeesFormProps) => {
  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    touched,
    values,
  } = props.formikProps;
  const { headerRow } = props;
  const {
    busy,
    getAddRowClickHandler,
    getEmailChangeHandler,
    getFieldError,
    hasExistingEmail,
    transformSalary,
  } = useEmployeeFormContext(props);

  return (
    <Form onSubmit={handleSubmit}>
      <FieldArray name="employees">
        {(helpers) => {
          return (
            <>
              <div className="employee-list__header">
                <h3 className="employee-list__title">Employee List</h3>

                <div className="employee-list__actions">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={getAddRowClickHandler(
                      isSubmitting,
                      helpers,
                      (headerRow?.length || 5) - 5,
                    )}
                    className="employee-list__actions--add-btn"
                  >
                    <PlusSvg /> Add Row
                  </button>

                  <Button
                    type="submit"
                    disabled={isSubmitting || busy || hasExistingEmail}
                    showSpinner={isSubmitting}
                    label="Proceed"
                    primary
                  />
                </div>
              </div>

              <div className="employee-list__table-container">
                <table className="employee-list__table">
                  <thead>
                    <tr>
                      {headerRow?.map((name) => {
                        return <th key={name}>{name}</th>;
                      })}
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {values.employees.map((employee, index) => {
                      return (
                        <tr key={`${employee.firstname}_${index}`}>
                          <td>
                            <EditableField
                              type="text"
                              placeholder="First Name"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name={`employees.${index}.firstname`}
                              value={employee.firstname}
                              error={getFieldError({
                                name: 'firstname',
                                index,
                                touched,
                                errors,
                              })}
                            />
                          </td>

                          <td>
                            <EditableField
                              type="text"
                              placeholder="Last Name"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name={`employees.${index}.lastname`}
                              value={employee.lastname}
                              error={getFieldError({
                                name: 'lastname',
                                index,
                                touched,
                                errors,
                              })}
                            />
                          </td>

                          <td>
                            <EditableField
                              type="number"
                              placeholder="Salary"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name={`employees.${index}.salary`}
                              value={employee.salary}
                              transformValue={transformSalary}
                              error={getFieldError({
                                name: 'salary',
                                index,
                                touched,
                                errors,
                              })}
                            />
                          </td>

                          <td>
                            <EditableField
                              type="text"
                              placeholder="Email"
                              onChange={getEmailChangeHandler({
                                handleChange,
                              })}
                              onBlur={handleBlur}
                              name={`employees.${index}.email`}
                              value={employee.email}
                              error={getFieldError({
                                name: 'email',
                                index,
                                touched,
                                errors,
                              })}
                            />
                          </td>

                          <td>
                            <EditableField
                              type="text"
                              placeholder="Phone Number"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name={`employees.${index}.phoneNumber`}
                              value={employee.phoneNumber}
                              error={getFieldError({
                                name: 'phoneNumber',
                                index,
                                touched,
                                errors,
                              })}
                            />
                          </td>

                          <PayoutDetailFields
                            payoutDetails={
                              values.employees[index].payoutDetails
                            }
                            name={`employees.${index}.payoutMethodMeta`}
                            payoutMethod={props.payoutMethod}
                            onChange={handleChange}
                          />

                          <td>
                            <button
                              title="delete row"
                              onClick={() => helpers.remove(index)}
                              type="button"
                              style={{
                                background: 'transparent',
                                border: 'none',
                              }}
                            >
                              <i className="fas fa-trash" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          );
        }}
      </FieldArray>
    </Form>
  );
};

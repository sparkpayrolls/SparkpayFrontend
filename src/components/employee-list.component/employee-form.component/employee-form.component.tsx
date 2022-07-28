import { Button } from '@/components/Button/Button.component';
import { PlusSvg } from '@/components/svg';
import { FieldArray } from 'formik';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Util } from 'src/helpers/util';
import { ConcealedInput } from './components';
import { useEmployeeFormContext } from './hooks';
import { PayoutDetailFields } from './payout-details-fields.component/payout-detail-fileds.component';
import { EmployeesFormProps } from './types';

export const EmployeesForm = (props: EmployeesFormProps) => {
  const { isSubmitting, values, handleBlur } = props.formikProps;
  const { headerRow, payoutMethodContext, payoutMethod } = props;
  const {
    changes,
    handleChange,
    handleSubmit,
    employeeLength,
    increaseEmployeeLength,
    busy,
    hasExistingEmail,
    getAddRowClickHandler,
    getFieldError,
  } = useEmployeeFormContext(props);

  return (
    <form
      style={{ width: '100%', height: '100%', overflowX: 'auto' }}
      onSubmit={handleSubmit}
    >
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
                    onClick={getAddRowClickHandler(isSubmitting, helpers)}
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

              <div className="employee-list__table-container flex-table">
                <div className="flex-table__tr">
                  {headerRow?.map((name) => {
                    return (
                      <div key={name} className="flex-table__th">
                        {name}
                      </div>
                    );
                  })}
                  <div className="flex-table__th"></div>
                </div>
                <div
                  id="scrollableDiv"
                  style={{
                    overflowX: 'auto',
                    height: 'calc(100% - 48px)',
                  }}
                >
                  <InfiniteScroll
                    hasMore
                    next={increaseEmployeeLength}
                    loader={null}
                    dataLength={employeeLength}
                    scrollableTarget="scrollableDiv"
                  >
                    {values.employees
                      .slice(0, employeeLength)
                      .map((_employee, index) => {
                        const employee = changes[index] || _employee;

                        return (
                          <div
                            key={`bulk_upload_employee_${index}`}
                            className="flex-table__tr"
                          >
                            <ConcealedInput
                              className="flex-table__td"
                              error={getFieldError({
                                name: 'firstname',
                                index,
                              })}
                              inputProps={{
                                className: 'employee-list__input',
                                defaultValue: employee.firstname,
                                name: `employees.${index}.firstname`,
                                onChange: handleChange,
                                onBlur: handleBlur,
                              }}
                            >
                              {employee.firstname}
                            </ConcealedInput>

                            <ConcealedInput
                              className="flex-table__td"
                              error={getFieldError({
                                name: 'lastname',
                                index,
                              })}
                              inputProps={{
                                className: 'employee-list__input',
                                defaultValue: employee.lastname,
                                name: `employees.${index}.lastname`,
                                onChange: handleChange,
                                onBlur: handleBlur,
                              }}
                            >
                              {employee.lastname}
                            </ConcealedInput>

                            <ConcealedInput
                              className="flex-table__td"
                              error={getFieldError({
                                name: 'salary',
                                index,
                              })}
                              inputProps={{
                                className: 'employee-list__input',
                                defaultValue: employee.salary,
                                type: 'number',
                                name: `employees.${index}.salary`,
                                onChange: handleChange,
                                onBlur: handleBlur,
                              }}
                            >
                              {props.currency}{' '}
                              {Util.formatMoneyNumber(+employee.salary, 2)}
                            </ConcealedInput>

                            <ConcealedInput
                              className="flex-table__td"
                              error={getFieldError({
                                name: 'email',
                                index,
                              })}
                              inputProps={{
                                type: 'email',
                                className: 'employee-list__input',
                                defaultValue: employee.email,
                                name: `employees.${index}.email`,
                                onChange: handleChange,
                                onBlur: handleBlur,
                              }}
                            >
                              {employee.email}
                            </ConcealedInput>

                            <ConcealedInput
                              className="flex-table__td"
                              error={getFieldError({
                                name: 'phoneNumber',
                                index,
                              })}
                              inputProps={{
                                className: 'employee-list__input',
                                defaultValue: employee.phoneNumber,
                                name: `employees.${index}.phoneNumber`,
                                onChange: handleChange,
                                onBlur: handleBlur,
                              }}
                            >
                              {employee.phoneNumber}
                            </ConcealedInput>

                            <PayoutDetailFields
                              name={`employees.${index}.payoutMethodMeta`}
                              payoutMehodContext={payoutMethodContext}
                              payoutMethod={employee.payoutMethod as string}
                              payoutMethodMeta={
                                employee.payoutMethodMeta as Record<
                                  string,
                                  unknown
                                >
                              }
                              payoutMethodName={payoutMethod}
                              onChange={handleChange}
                            />

                            <div className="flex-table__td">
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
                            </div>
                          </div>
                        );
                      })}
                  </InfiniteScroll>
                </div>
              </div>
            </>
          );
        }}
      </FieldArray>
    </form>
  );
};

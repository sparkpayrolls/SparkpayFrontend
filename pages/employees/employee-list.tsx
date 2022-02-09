import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import DashboardLayoutV2 from '../../src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import { Button } from '@/components/Button/Button.component';
import { PlusSvg } from '../../src/components/svg/index';
import { Util } from 'src/helpers/util';
import { $api } from 'src/api';
import { FieldArray, Form, Formik, getIn } from 'formik';
import { useAppSelector } from 'src/redux/hooks';
import { BulkEmployeeAddValidation } from 'src/helpers/validation';
import { HttpError } from 'src/api/repo/http.error';
import { toast } from 'react-toastify';
import withAuth from 'src/helpers/HOC/withAuth';
import { DeleteTaxSVG } from './../../src/components/svg/index';
import { EditableField } from '@/components/Input/editable-field.component';

interface BulkEmployeeUploadList {
  firstname: string;
  lastname: string;
  email: string;
  salary: string;
}

const emptyEmployee = {
  firstname: '',
  lastname: '',
  email: '',
  salary: '',
};

const emailExists = Util.debounce(
  // eslint-disable-next-line no-unused-vars
  (email: string, callback: (_exists: boolean) => any) => {
    $api.employee
      .findEmployeeByEmail(email)
      .then(() => callback(true))
      .catch(() => callback(false));
  },
  500,
);

let lastEmail: string[] = [];

function EmployeeList() {
  const router = useRouter();
  const administrator = useAppSelector((state) => state.administrator);
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const [employees, setEmployees] = useState<BulkEmployeeUploadList[] | null>(
    null,
  );

  const getEmployees = useCallback(async () => {
    try {
      const jwt = router.query.data;
      if (jwt && typeof jwt === 'string') {
        const parsed = await $api.file.parseXlsxFile<Record<string, any>>(jwt);
        const employees = parsed['Employee data'].map(
          (data: Record<string, string>) => ({
            firstname: data.Firstname,
            lastname: data.Lastname,
            email: data.Email,
            salary: data.Salary,
          }),
        );
        setEmployees(employees);
        router.push(router.pathname);
        return;
      }
    } catch (error) {
      // ...
    }
    setEmployees([emptyEmployee]);
  }, [router]);

  const transformSalary = (val: string) => {
    const valTransformed = +`${val}`.replace(/[^0-9.]/gi, '');
    if (!valTransformed) return '';

    return `${currency} ${valTransformed.toLocaleString()}`;
  };

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  useEffect(() => {
    const interceptRefresh = (e: BeforeUnloadEvent) => {
      var message = 'Your changes are not saved.';
      e = e || window.event;
      // For IE and Firefox
      if (e) {
        e.returnValue = message;
      }

      // For Safari
      return message;
    };
    window.addEventListener('beforeunload', interceptRefresh);
    return () => {
      window.removeEventListener('beforeunload', interceptRefresh);
    };
  }, []);

  return (
    <DashboardLayoutV2 title="Employee list" href="/employees">
      <div className="employee-list">
        {employees && (
          <Formik
            initialValues={{ employees }}
            validationSchema={BulkEmployeeAddValidation}
            onSubmit={async (values, helpers) => {
              try {
                helpers.setSubmitting(true);
                await $api.employee.addEmployees(values as any);
                toast.success('Employees added successfully.');
                router.push('/employees');
              } catch (error) {
                const err = error as HttpError;
                toast.error(err.message);
              } finally {
                helpers.setSubmitting(false);
              }
            }}
          >
            {(props) => {
              const {
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                isSubmitting,
                handleSubmit,
                setSubmitting,
                setErrors,
              } = props;

              return (
                <Form onSubmit={handleSubmit}>
                  <FieldArray name="employees">
                    {(helpers) => {
                      return (
                        <>
                          <div className="employee-list__header">
                            <h3 className="employee-list__title">
                              Employee List
                            </h3>

                            {/* //TODO Display Kebab menu on mobile screens */}
                            <div className="employee-list__actions">
                              <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (isSubmitting) {
                                    return;
                                  }

                                  helpers.push(emptyEmployee);
                                }}
                                className="employee-list__actions--add-btn"
                              >
                                <PlusSvg /> Add Row
                              </button>
                              <Button
                                type="submit"
                                disabled={isSubmitting}
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
                                  <th>First Name</th>
                                  <th>Last Name</th>
                                  <th>Email Address</th>
                                  <th>Salary Amount ({currency})</th>
                                  <th></th>
                                </tr>
                              </thead>

                              <tbody>
                                {values.employees.map((employee, i) => {
                                  const emailTouched = getIn(
                                    touched,
                                    `employees.${i}.email`,
                                  );
                                  const emailError = getIn(
                                    errors,
                                    `employees.${i}.email`,
                                  );
                                  if (
                                    !emailError &&
                                    employee.email &&
                                    !isSubmitting &&
                                    !lastEmail.includes(employee.email)
                                  ) {
                                    setSubmitting(true);
                                    const employees = [
                                      ...(getIn(errors, 'employees') || []),
                                    ];
                                    emailExists(employee.email, (exists) => {
                                      setSubmitting(false);
                                      if (exists) {
                                        employees[i] = {
                                          ...(getIn(errors, `employees.${i}`) ||
                                            {}),
                                          email:
                                            'Employee with email already exists.',
                                        };
                                        setErrors({
                                          ...errors,
                                          employees,
                                        });
                                      } else lastEmail.push(employee.email);
                                    });
                                  }
                                  return (
                                    <tr key={i}>
                                      <td>
                                        <EditableField
                                          type="text"
                                          placeholder="First Name"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          name={`employees.${i}.firstname`}
                                          value={employee.firstname}
                                          error={
                                            getIn(
                                              touched,
                                              `employees.${i}.firstname`,
                                            ) &&
                                            getIn(
                                              errors,
                                              `employees.${i}.firstname`,
                                            )
                                          }
                                        />
                                      </td>

                                      <td>
                                        <EditableField
                                          type="text"
                                          placeholder="Last Name"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          name={`employees.${i}.lastname`}
                                          value={employee.lastname}
                                          error={
                                            getIn(
                                              touched,
                                              `employees.${i}.lastname`,
                                            ) &&
                                            getIn(
                                              errors,
                                              `employees.${i}.lastname`,
                                            )
                                          }
                                        />
                                      </td>

                                      <td>
                                        <EditableField
                                          loading={isSubmitting}
                                          type="email"
                                          placeholder="Email"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          name={`employees.${i}.email`}
                                          value={employee.email}
                                          error={emailTouched && emailError}
                                        />
                                      </td>
                                      <td>
                                        <EditableField
                                          type="number"
                                          placeholder={`Salary (${currency})`}
                                          onChange={handleChange}
                                          transformValue={transformSalary}
                                          onBlur={handleBlur}
                                          name={`employees.${i}.salary`}
                                          value={employee.salary}
                                          error={
                                            getIn(
                                              touched,
                                              `employees.${i}.salary`,
                                            ) &&
                                            getIn(
                                              errors,
                                              `employees.${i}.salary`,
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <Button
                                          label={
                                            <>
                                              <DeleteTaxSVG />
                                              &nbsp;{'Delete'}
                                            </>
                                          }
                                          danger
                                          size="small"
                                          type="button"
                                        />
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
            }}
          </Formik>
        )}
      </div>
    </DashboardLayoutV2>
  );
}

export default withAuth(EmployeeList, ['Employee', 'write']);

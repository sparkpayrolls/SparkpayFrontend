import { useRouter } from 'next/router';
import {
  useState,
  useEffect,
  useCallback,
  DetailedHTMLProps,
  InputHTMLAttributes,
} from 'react';
import DashboardLayoutV2 from '../../src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import { Button } from '@/components/Button/Button.component';
import { EditableSVG, PlusSvg } from '../../src/components/svg/index';
import { Util } from 'src/helpers/util';
import { $api } from 'src/api';
import { FieldArray, Form, Formik, getIn } from 'formik';
import { InputError } from '@/components/Shared/input-error.component';
import classNames from 'classnames';
import { useAppSelector } from 'src/redux/hooks';
import { BulkEmployeeAddValidation } from 'src/helpers/validation';
import { HttpError } from 'src/api/repo/http.error';
import { toast } from 'react-toastify';
import withAuth from 'src/helpers/HOC/withAuth';

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

function EmployeeList() {
  const router = useRouter();
  const administrator = useAppSelector((state) => state.administrator);
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const [employees, setEmployees] = useState<BulkEmployeeUploadList[] | null>(
    null,
  );

  const getEmployees = useCallback(async () => {
    try {
      const jwt = router.query.file;
      if (jwt && typeof jwt === 'string') {
        const file = Util.decodeToken<{ data: string }>(jwt);
        const parsed = await $api.file.parseXlsxFile<Record<string, any>>(
          file.data,
        );
        const employees = parsed['Employee data'].map(
          (data: Record<string, string>) => ({
            firstname: data.Firstname,
            lastname: data.Lastname,
            email: data.Email,
            salary: data.Salary,
          }),
        );
        setEmployees(employees);
        return;
      }
    } catch (error) {
      // ...
    }
    setEmployees([emptyEmployee]);
  }, [router]);

  const transformSalary = (val: string) => {
    const valTransformed = +val.replace(/[^0-9]/gi, '');
    if (!valTransformed) return '';

    return `${currency} ${valTransformed.toLocaleString()}`;
  };

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

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
                const employees = values.employees.map((e) => {
                  e.salary = String(e.salary).replace(/[^0-9]/gi, '');

                  return e;
                }) as any;
                await $api.employee.addEmployees({ employees });
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
                                  return (
                                    <tr key={i}>
                                      <td>
                                        <EditableField
                                          readOnly={isSubmitting}
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
                                          readOnly={isSubmitting}
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
                                          readOnly={isSubmitting}
                                          type="email"
                                          placeholder="Email"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          name={`employees.${i}.email`}
                                          value={employee.email}
                                          error={
                                            getIn(
                                              touched,
                                              `employees.${i}.email`,
                                            ) &&
                                            getIn(
                                              errors,
                                              `employees.${i}.email`,
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <EditableField
                                          readOnly={isSubmitting}
                                          type="text"
                                          placeholder={`Salary (${currency})`}
                                          onChange={(e) => {
                                            e.target.value = transformSalary(
                                              e.target.value,
                                            );

                                            handleChange(e);
                                          }}
                                          onBlur={handleBlur}
                                          name={`employees.${i}.salary`}
                                          value={transformSalary(
                                            `${employee.salary}`,
                                          )}
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
                                        <button
                                          style={{
                                            verticalAlign: 'middle',
                                            cursor: 'pointer',
                                          }}
                                          type="button"
                                          disabled={isSubmitting}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            if (isSubmitting) {
                                              return;
                                            }

                                            helpers.remove(i);
                                            if (
                                              i === 0 &&
                                              values.employees.length <= 1
                                            ) {
                                              helpers.push(emptyEmployee);
                                            }
                                          }}
                                        >
                                          Delete
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
            }}
          </Formik>
        )}
      </div>
    </DashboardLayoutV2>
  );
}

const EditableField = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & { error?: boolean | string },
) => {
  const inputClassname = classNames('employee-list__input-container__input', {
    'employee-list__input-container__input--has-error': !!props.error,
  });

  return (
    <div className="employee-list__input-container">
      <input {...props} className={inputClassname} />
      <span>
        <EditableSVG />
      </span>
      <div className="employee-list__input-container__error">
        <InputError>{props.error}</InputError>
      </div>
    </div>
  );
};

export default withAuth(EmployeeList, ['Employee', 'write']);
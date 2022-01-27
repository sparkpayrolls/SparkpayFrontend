import { NextPage } from 'next';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import { Button } from '../../src/components/Button/Button.component';
import Image from 'next/image';
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
} from 'react';
import { EditableSVG, } from '../../src/components/svg/index';
import { FieldArray, Form, Formik } from 'formik';
import { InputError } from '@/components/Shared/input-error.component';
import classNames from 'classnames';
import { BulkEmployeeAddValidation } from 'src/helpers/validation';

import backicon from '../../public/svgs/back-icon.svg';
import Link from 'next/link';
import EmployeeSearchIcon from "../../public/svgs/search-icon.svg"




// interface BulkEmployeeTaxList {
//   Name: string;
//   PhoneNumber: string;
//   PayeeID: string;
//  TaxState: string;
// }

// const emptyEmployee = {
//   Name: '',
//   PhoneNumber: '',
//   PayeeID: '',
//  TaxState: '',
// };
const EmployeeTaxList: NextPage = () => {
  return (
    <DashboardLayout pageTitle="remittances-tax">
      <div className="remittances-tax-page">
        <div className="remittances-tax-section">
          <div className="group-details__header-content">
            <div className="group-details__group-detail-title-section">
              <Link href="/remittances">
                <a>
                  <Image
                    src={backicon}
                    alt="group-details-image"
                    className="group-details__prev-icon"
                  />
                </a>
              </Link>
              <h5 className="group-details__group-detail-title">Tax</h5>
            </div>
            <Button
              label={<>{'Save'}</>}
              element="a"
              className="payroll-section__submit-btn"
              primary
              type="submit"
            />
          </div>
          <div className="remittances-tax-page__tax-details">
            <div className="remittances-tax-page__tax-section-list">
            <div className="remittances-tax-page__employee-list-search">
              <p>Search</p>
              <div className="remittances-tax-page__employee-tax-flex">
               <input type="text"
                    placeholder='Search by employee name or email'
                  className="remittances-tax-page__employee-input"
                />
                 <div  className="remittances-tax-page__employee-image"
                >
                <Image
                  src={EmployeeSearchIcon}
                  alt="group-details-image"/>                
                 </div>
             </div>
                <Formik
                  initialValues={{  }}
                  validationSchema={BulkEmployeeAddValidation}
                  onSubmit={async () => {
                    // try {
                    //   helpers.setSubmitting(true);
                    //   const employees = values.employees.map((e) => {
                    //     e.salary = String(e.salary).replace(/[^0-9]/gi, '');

                    //     return e;
                    //   }) as any;
                    //   await $api.employee.addEmployees({ employees });
                    //   toast.success('Employees added successfully.');
                    //   router.push('/employees');
                    // } catch (error) {
                    //   const err = error as HttpError;
                    //   toast.error(err.message);
                    // } finally {
                    //   helpers.setSubmitting(false);
                    // }
                  }}
                >
                  {(props) => {
                    const {
                      // values,
                      // errors,
                      // touched,
                      // handleChange,
                      // handleBlur,
                      isSubmitting,
                      handleSubmit,
                    } = props;

                    return (
                      <Form onSubmit={handleSubmit}>
                        <FieldArray name="employees">
                          {() => {
                            return (
                              <>
                                <div className="employee-list__header">
                                  <h3 className="employee-list__title">
                                    Employee List
                                  </h3>

                                  {/* //TODO Display Kebab menu on mobile screens */}
                                  <div className="employee-list__actions">
                                    {/* <button
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
                                    </button> */}
                                    {/* <Button
                                      type="submit"
                                      disabled={isSubmitting}
                                      showSpinner={isSubmitting}
                                      label="Proceed"
                                      primary
                                    /> */}
                                  </div>
                                </div>

                                <div className="employee-list__table-container">
                                  <table className="employee-list__table">
                                    <thead>
                                      <tr>
                                        <th>Name</th>
                                        <th>Phone Number</th>
                                        <th>Payee ID</th>
                                        <th>Tax State</th>
                                        <th></th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      {/* {values.employees.map((employee, i) => {
                                        return ( */}
                                          <tr>
                                            <td>
                                              <EditableField
                                                // readOnly={isSubmitting}
                                                // type="text"
                                                // placeholder="First Name"
                                                // onChange={handleChange}
                                                // onBlur={handleBlur}
                                                // name={`employees.${i}.firstname`}
                                                // value={employee.firstname}
                                                // error={
                                                //   getIn(
                                                //     touched,
                                                //     `employees.${i}.firstname`,
                                                //   ) &&
                                                //   getIn(
                                                //     errors,
                                                //     `employees.${i}.firstname`,
                                                //   )
                                                // }
                                              />
                                            </td>

                                            <td>
                                              <EditableField
                                                // readOnly={isSubmitting}
                                                // type="text"
                                                // placeholder="Last Name"
                                                // onChange={handleChange}
                                                // onBlur={handleBlur}
                                                // name={`employees.${i}.lastname`}
                                                // value={employee.lastname}
                                                // error={
                                                //   getIn(
                                                //     touched,
                                                //     `employees.${i}.lastname`,
                                                //   ) &&
                                                //   getIn(
                                                //     errors,
                                                //     `employees.${i}.lastname`,
                                                //   )
                                                // }
                                              />
                                            </td>

                                            <td>
                                              <EditableField
                                                // readOnly={isSubmitting}
                                                // type="email"
                                                // placeholder="Email"
                                                // onChange={handleChange}
                                                // onBlur={handleBlur}
                                                // name={`employees.${i}.email`}
                                                // value={employee.email}
                                                // error={
                                                //   getIn(
                                                //     touched,
                                                //     `employees.${i}.email`,
                                                //   ) &&
                                                //   getIn(
                                                //     errors,
                                                //     `employees.${i}.email`,
                                                //   )
                                                // }
                                              />
                                            </td>
                                            <td>
                                              <EditableField
                                              //   readOnly={isSubmitting}
                                              //   type="text"
                                              //   placeholder={`Salary`}
                                              //   onChange={(e) => {
                                              //     e.target.value = transformSalary(
                                              //       e.target.value,
                                              //     );

                                              //     handleChange(e);
                                              //   }}
                                              //   onBlur={handleBlur}
                                              //   name={`employees`}
                                              //  }
                                                // error={
                                                //   getIn(
                                                //     touched,
                                                //     `employees.${i}.salary`,
                                                //   ) &&
                                                //   getIn(
                                                //     errors,
                                                //     `employees.${i}.salary`,
                                                //   )
                                                // }
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
                                                // onClick={(e) => {
                                                //   e.preventDefault();
                                                //   if (isSubmitting) {
                                                //     return;
                                                //   }

                                                //   helpers.remove(i);
                                                //   if (
                                                //     i === 0 &&
                                                //     values.employees.length <= 1
                                                //   ) {
                                                //     helpers.push(emptyEmployee);
                                                //   }
                                                // }}
                                              >
                                                Delete
                                              </button>
                                            </td>
                                          </tr>
                         
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
            </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

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

export default EmployeeTaxList;

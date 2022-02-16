import { useRouter } from 'next/router';
import { useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { stringifyUrl } from 'query-string';
import { Util } from 'src/helpers/util';
import {
  bulkEmployeeFileUploadValidationSchema,
  singleEmployeeUploadValidationSchema,
} from 'src/helpers/validation';
import { Button } from '../Button/Button.component';
import { InputV2 } from '../Input/Input.component';
import { AddEmployee, IEmployeeAddForm } from '../types';
import { AddFileSVG } from '@/components/svg';
import classNames from 'classnames';
import { InputError } from '../Shared/input-error.component';
import { config } from 'src/helpers/config';
import { getBulkEmployeeFileUploadHandler } from 'src/helpers/methods';
import { $api } from 'src/api';
import { toast } from 'react-toastify';

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
const lastEmail: string[] = [];

export const EmployeeAddForm = (props: IEmployeeAddForm) => {
  const { initialValues, onSubmit, currency } = props;
  const isEditing =
    initialValues.firstname ||
    initialValues.lastname ||
    initialValues.email ||
    initialValues.salary;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={singleEmployeeUploadValidationSchema}
      onSubmit={onSubmit}
    >
      {(props: FormikProps<AddEmployee>) => {
        const {
          handleChange,
          handleSubmit,
          handleBlur,
          values,
          errors,
          touched,
          isSubmitting,
          setErrors,
          setSubmitting,
        } = props;
        if (
          !errors.email &&
          touched.email &&
          values.email &&
          !isSubmitting &&
          !lastEmail.includes(values.email)
        ) {
          setSubmitting(true);
          emailExists(values.email, (exists) => {
            setSubmitting(false);
            if (exists) {
              setErrors({
                ...errors,
                email: 'Employee with email already exists.',
              });
            } else lastEmail.push(values.email);
          });
        }

        return (
          <form
            onSubmit={handleSubmit}
            className="edit-details-form"
            autoComplete="off"
          >
            <div className="form__grid single-employee-upload-form__section">
              <div className="form__grid__col--6 padding-right-space-1">
                <InputV2
                  label="First Name"
                  placeholder="First Name"
                  name="firstname"
                  value={values.firstname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.firstname && errors.firstname}
                />
              </div>

              <div className="form__grid__col--6 padding-left-space-1">
                <InputV2
                  label="Last Name"
                  placeholder="Last Name"
                  name="lastname"
                  value={values.lastname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.lastname && errors.lastname}
                />
              </div>
            </div>

            <div className="single-employee-upload-form__section">
              <InputV2
                type="email"
                label="Email Address"
                placeholder="Email Address"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                loading={isSubmitting}
              />
            </div>

            <div className="single-employee-upload-form__section">
              <InputV2
                type="tel"
                label="Phone Number"
                placeholder="Phone Number"
                name="phoneNumber"
                value={(values as any).phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={(touched as any).phoneNumber && (errors as any).phoneNumber}
              />
            </div>

            <div className="single-employee-upload-form__section">
              <InputV2
                type="number"
                label={`Salary Amount (${currency})`}
                placeholder={`Salary Amount (${currency})`}
                name="salary"
                value={values.salary}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.salary && errors.salary}
                transformValue={(val) => {
                  const valTransformed = +`${val}`.replace(/[^0-9.]/gi, '');
                  if (isNaN(valTransformed) || val === '') return '';

                  return `${currency} ${valTransformed.toLocaleString()}`;
                }}
              />
            </div>

            <div className="form__submit-button">
              <Button
                type="submit"
                label={isEditing ? 'Save Details' : 'Save Employee'}
                className="form__submit-button form__submit-button--full-width"
                primary
                disabled={
                  isSubmitting || Util.deepEquals(values, initialValues)
                }
                showSpinner={isSubmitting}
              />
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export const EmployeeBulkAddForm = (props: { onSubmit?: () => void }) => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploadTextActive, setUploadTextActive] = useState(false);
  const fileUploadClass = classNames('form__file-upload', {
    ['active']: !!file || uploadTextActive,
  });

  return (
    <Formik
      initialValues={{ file: '' }}
      validationSchema={bulkEmployeeFileUploadValidationSchema}
      onSubmit={({ file }, helpers) => {
        helpers.setSubmitting(true);
        $api.file
          .uploadTemporaryFile(JSON.parse(file))
          .then((file) => {
            const url = stringifyUrl({
              url: '/employees/employee-list',
              query: { file: file.id },
            });

            props.onSubmit && props.onSubmit();
            router.replace(url);
          })
          .catch((error) => {
            toast.error(error.message);
          })
          .finally(() => {
            helpers.setSubmitting(false);
          });
      }}
    >
      {(props: FormikProps<{ file: string }>) => {
        const {
          handleSubmit,
          isSubmitting,
          setValues,
          setTouched,
          touched,
          errors,
        } = props;

        return (
          <form
            onSubmit={handleSubmit}
            className="edit-details-form"
            autoComplete="off"
          >
            <label>
              <div
                className={fileUploadClass}
                draggable
                onDragOver={() => setUploadTextActive(true)}
                onDragLeave={() => setUploadTextActive(false)}
              >
                <AddFileSVG />
                <p className="form__file-upload--text">
                  {file ? (
                    file.name
                  ) : (
                    <>
                      <span className="form__file-upload-text--highlight">
                        Upload a file
                      </span>{' '}
                      or drag and drop
                    </>
                  )}
                </p>

                <span className="form__file-upload-subtext">
                  {file ? <>Change File</> : <>Spreadsheet (xlsx) up to 10MB</>}
                </span>
                <input
                  type="file"
                  name="xlslFile"
                  accept=".xlsx"
                  onChange={getBulkEmployeeFileUploadHandler({
                    setTouched,
                    setValues,
                    setFile,
                  })}
                />
              </div>
              <InputError>{touched.file && errors.file}</InputError>
            </label>

            <a
              className="form__sample-btn"
              download="employee_upload_format.xlsx"
              href={config.employeeUploadSample}
            >
              Download Format
            </a>

            <div className="form__submit-button">
              <Button
                type="submit"
                label="Proceed"
                className="form__submit-button form__submit-button--full-width"
                primary
                disabled={isSubmitting}
                showSpinner={isSubmitting}
              />
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

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
import { Input } from '../Input/Input.component';
import { AddEmployee, IEmployeeAddForm } from '../types';
import { AddFileSVG } from '@/components/svg';
import classNames from 'classnames';
import { InputError } from '../Shared/input-error.component';
import { config } from 'src/helpers/config';
import { getBulkEmployeeFileUploadHandler } from 'src/helpers/methods';

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
        } = props;

        return (
          <form
            onSubmit={handleSubmit}
            className="edit-details-form"
            autoComplete="off"
          >
            <div className="form__grid single-employee-upload-form__section">
              <div className="form__grid__col--6 padding-right-space-1">
                <Input
                  label="First Name"
                  type="text"
                  placeholder="First Name"
                  name="firstname"
                  value={values.firstname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  hasError={errors.firstname && touched.firstname}
                  error={errors.firstname}
                />
              </div>

              <div className="form__grid__col--6 padding-left-space-1">
                <Input
                  type="text"
                  label="Last Name"
                  placeholder="Last Name"
                  name="lastname"
                  value={values.lastname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  hasError={errors.lastname && touched.lastname}
                  error={errors.lastname}
                />
              </div>
            </div>

            <div className="single-employee-upload-form__section">
              <Input
                type="email"
                label="Email Address"
                placeholder="Email Address"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={errors.email && touched.email}
                error={errors.email}
              />
            </div>

            <div className="single-employee-upload-form__section">
              <Input
                type="text"
                label={`Salary Amount (${currency})`}
                placeholder={`Salary Amount (${currency})`}
                name="salary"
                value={values.salary}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={errors.salary && touched.salary}
                error={errors.salary}
                transformValue={(val) => {
                  const valTransformed = +val.replace(/[^0-9]/gi, '');
                  if (!valTransformed) return '';

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
                  isSubmitting ||
                  Util.deepEquals(
                    {
                      ...values,
                      salary: values.salary.replace(/[^0-9]/gi, ''),
                    },
                    initialValues,
                  )
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
      onSubmit={({ file }) => {
        const url = stringifyUrl({
          url: '/employees/employee-list',
          query: { file },
        });

        props.onSubmit && props.onSubmit();
        router.replace(url);
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

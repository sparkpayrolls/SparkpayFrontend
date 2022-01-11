import { useRef, useEffect } from 'react';
import { Formik, FormikProps } from 'formik';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { Util } from 'src/helpers/util';
import { singleEmployeeUploadValidationSchema } from 'src/helpers/validation';
import { Button } from '../Button/Button.component';
import { Input } from '../Input/Input.component';
import { AddEmployee, IEmployeeAddForm } from '../types';
import { AddFileSVG } from '@/components/svg';

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
const validExtensions = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
];

export const EmployeeBulkAddForm = (props: IEmployeeAddForm) => {
  const { initialValues, onSubmit, currency } = props;
  const uploadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function uploadDragover(e) {
      e.preventDefault();
      console.log('Click clicked!!!', uploadRef.current?.className);
      $('.form__file-upload').addClass('active');
    }

    function uploadDragleave(e) {
      e.preventDefault();
      $('.form__file-upload').removeClass('active');
    }

    function uploadFile(e) {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      console.log(file);
      const fileType = file.type;

      if (!validExtensions.includes(file.type)) {
        toast.error(`Upload a valid Spreadsheet file`, {
          position: 'top-center',
        });
        $('.form__file-upload').removeClass('active');
        return;
      }

      if (file.size * 1e-6 > 10) {
        toast.error(`Upload a valid Spreadsheet file`, {
          position: 'top-center',
        });

        $('.form__file-upload').removeClass('active');
        return;
      }

      console.log('Appropriate file type');
      const fileReader = new window.FileReader();

      fileReader.onload = () => {
        const fileURL = fileReader.result;
        $('.form__file-upload-text').html(file.name);
        $('.form__file-upload-subtext').html('Change file');
        // console.log(fileURL);
      };

      fileReader.readAsDataURL(file);
    }

    if (uploadRef && uploadRef.current) {
      const uploadDivRef = uploadRef.current;
      uploadDivRef.addEventListener('dragover', uploadDragover);
      uploadDivRef.addEventListener('dragleave', uploadDragleave);
      uploadDivRef.addEventListener('drop', uploadFile);

      return () => {
        // cleanup
        uploadDivRef.removeEventListener('dragover', uploadDragover);
        uploadDivRef.removeEventListener('dragleave', uploadDragleave);
        uploadDivRef.removeEventListener('drop', uploadFile);
      };
    }
  }, []);

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
            <label>
              <div className="form__file-upload" ref={uploadRef}>
                <AddFileSVG />
                <p className="form__file-upload-text">
                  <span className="form__file-upload-text--highlight">
                    Upload a file
                  </span>{' '}
                  or drag and drop
                </p>

                <span className="form__file-upload-subtext">
                  Spreadsheet (xlsl) up to 10MB
                </span>
              </div>
              <input
                type="file"
                name="xlslFile"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const [file] = e.target.files;
                  console.log(file);

                  if (!validExtensions.includes(file.type)) {
                    toast.error(`Upload a valid Spreadsheet file`, {
                      position: 'top-center',
                    });
                    $('.form__file-upload').removeClass('active');
                    return;
                  }

                  if (file.size * 1e-6 > 10) {
                    toast.error(`Upload a valid Spreadsheet file`, {
                      position: 'top-center',
                    });

                    $('.form__file-upload').removeClass('active');
                    return;
                  }

                  $('.form__file-upload-text').html(file.name);
                  $('.form__file-upload-subtext').html('Change file');
                }}
              />
            </label>

            <a className="form__sample-btn" href="#">
              Download Sample
            </a>

            <div className="form__submit-button">
              <Button
                type="submit"
                label="Proceed"
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

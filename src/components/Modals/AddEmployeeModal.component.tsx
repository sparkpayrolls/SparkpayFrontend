import React, { useState } from 'react';
import NiceModal, { NiceModalHandler } from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { Radio } from 'antd';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { Input } from '../Input/Input.component';
import { Button } from '../Button/Button.component';
import { singleEmployeeUploadValidationSchema } from 'src/helpers/validation';
import { AddEmployee, ISingleEmployeeUpload } from '../types';
import { HttpError } from 'src/api/repo/http.error';
import { toast } from 'react-toastify';
import { $api } from 'src/api';

export const AddEmployeeModal = NiceModal.create(() => { 
  return (
    <ModalLayout title="Add Employee">
      {(modal) => {
        return <AddEmployeeForm modal={modal} />;
      }}
    </ModalLayout>
  );
});

const AddEmployeeForm = ({ modal }: { modal: NiceModalHandler }) => {
  const [uploadType, setUploadType] = useState<'singleUpload' | 'bulkUpload'>(
    'singleUpload',
  );

  return (
    <div className="add-employee-modal">
      <div className="add-employee-modal__upload-type-input">
        <label>Select Upload Type</label>
        <Radio.Group
          name="uploadType"
          onChange={(e) => setUploadType(e.target.value)}
          className="add-employee-modal__upload-type-input__radio-group"
          value={uploadType}
        >
          <Radio value="singleUpload">Single Upload</Radio>
          <Radio value="bulkUpload">Bulk Upload</Radio>
        </Radio.Group>
      </div>

      {uploadType === 'singleUpload' && (
        <SingleEmployeeUpload onDone={() => modal.hide()} />
      )}
    </div>
  );
};

const SingleEmployeeUpload = (props: ISingleEmployeeUpload) => {
  const { onDone } = props;
  const handleSubmit = async (
    values: AddEmployee,
    helpers: FormikHelpers<AddEmployee>,
  ) => {
    try {
      helpers.setSubmitting(true);
      const salary = +values.salary.replace(/[^0-9]/gi, '');
      const employee = await $api.employee.addSingleEmployee({
        ...values,
        salary,
      });
      toast.success('Employee added successfully');
      if (onDone) {
        onDone(employee);
      }
    } catch (error) {
      const err = error as HttpError;
      if (err.errors && Object.keys(err.errors).length) {
        helpers.setErrors(err.errors);
      } else {
        toast.error(err.message);
      }
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        firstname: '',
        lastname: '',
        email: '',
        salary: '',
      }}
      validationSchema={singleEmployeeUploadValidationSchema}
      onSubmit={handleSubmit}
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
            className="single-employee-upload-form"
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
                label="Salary Amount (₦)"
                placeholder="Salary Amount (₦)"
                name="salary"
                value={values.salary}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={errors.salary && touched.salary}
                error={errors.salary}
                transformValue={(val) => {
                  const valTransformed = +val.replace(/[^0-9]/gi, '');
                  if (!valTransformed) return '';

                  return `₦ ${valTransformed.toLocaleString()}`;
                }}
              />
            </div>

            <div className="form__submit-button">
              <Button
                type="submit"
                label="Save Employee"
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

import React from 'react';
import NiceModal, { NiceModalHandler } from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { Input } from '../Input/Input.component';
import { Button } from '../Button/Button.component';
import { singleEmployeeUploadValidationSchema } from 'src/helpers/validation';
import { AddEmployee, ISingleEmployeeUpload } from '../types';
import { HttpError } from 'src/api/repo/http.error';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { Administrator } from 'src/api/types';
import { Util } from 'src/helpers/util';

export const EditDetailsModal = NiceModal.create(
  (props: { administrator: Administrator }) => {
    return (
      <ModalLayout title="Edit Details">
        {(modal) => {
          return (
            <EditDetailsForm
              modal={modal}
              administrator={props.administrator}
            />
          );
        }}
      </ModalLayout>
    );
  },
);

const EditDetailsForm = ({
  modal,
  administrator,
}: {
  modal: NiceModalHandler;
  administrator: Administrator;
}) => {
  return (
    <div className="edit-details-modal">
    <EditDetailsProps
          onDone={(employee) => {
            modal.resolve(employee);
            setTimeout(modal.hide, 100);
          }}
          administrator={administrator}
        />
    </div>
  );
};

const EditDetailsProps= (props: ISingleEmployeeUpload) => {
  const { onDone, administrator } = props;

  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
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
                label="Save Details"
                className="form__submit-button form__submit-button--full-width"
                primary
                disabled={isSubmitting}
                showSpinner={isSubmitting}
              />
            </div>
                  </form>
        )
      }}
    </Formik>
  );
};

import React, { useEffect } from 'react';
import NiceModal, { NiceModalHandler } from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { Input } from '../Input/Input.component';
import { Button } from '../Button/Button.component';
import { createOrganizationValidationSchema } from 'src/helpers/validation';
import { CreateOrganization } from '../types';
import { HttpError } from 'src/api/repo/http.error';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { SelectInput } from '../Input/seletct-input';
import { getCountries } from 'src/redux/slices/countries/countries.slice';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';

export const CreateOrgnizationModal = NiceModal.create(() => {
  return (
    <ModalLayout title="Create Organisation">
      {(modal) => {
        return <CreateOrganizationForm modal={modal} />;
      }}
    </ModalLayout>
  );
});

const CreateOrganizationForm = ({ modal }: { modal: NiceModalHandler }) => {
  const dispatch = useAppDispatch();
  const countries = useAppSelector((state) => state.countries);

  useEffect(() => {
    getCountries(dispatch);
  }, [dispatch]);

  const handleSubmit = async (
    values: CreateOrganization,
    helpers: FormikHelpers<CreateOrganization>,
  ) => {
    try {
      helpers.setSubmitting(true);
      await $api.company.createCompany(values);
      toast.success('Organization created successfully');
      modal.hide();
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
        name: '',
        country: '',
        email: '',
        phonenumber: '',
      }}
      validationSchema={createOrganizationValidationSchema}
      onSubmit={handleSubmit}
    >
      {(props: FormikProps<CreateOrganization>) => {
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
            className="create-organization-form"
            autoComplete="off"
          >
            <div className="create-organization-form__section">
              <Input
                type="text"
                label="Company Name"
                placeholder="Company Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={errors.name && touched.name}
                error={errors.name}
              />
            </div>

            <div className="create-organization-form__section">
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

            <div className="create-organization-form__section">
              <Input
                type="tel"
                label="Phone No."
                placeholder="Phone No."
                name="phonenumber"
                value={values.phonenumber}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={errors.phonenumber && touched.phonenumber}
                error={errors.phonenumber}
              />
            </div>

            <div className="create-organization-form__section">
              <SelectInput
                options={countries}
                displayValue="name"
                actualValue="id"
                name="country"
                value={values.country}
                label="Country"
                onChange={handleChange}
                onBlur={handleBlur}
                loading={!countries.length}
                error={(touched.country && errors.country) || ''}
              />
            </div>

            <div className="form__submit-button">
              <Button
                type="submit"
                label="Create Organisation"
                className="form__submit-button form__submit-button--full-width"
                primary
                disabled={isSubmitting || !countries.length}
                showSpinner={isSubmitting || !countries.length}
              />
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

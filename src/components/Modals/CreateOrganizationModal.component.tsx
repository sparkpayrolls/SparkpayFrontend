import React, { useEffect } from 'react';
import NiceModal, { NiceModalHandler } from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { FormikHelpers, FormikProps, Formik } from 'formik';
import { InputV2 } from '../Input/Input.component';
import { Button } from '../Button/Button.component';
import { createOrganizationValidationSchema } from 'src/helpers/validation';
import { CreateOrganization } from '../types';
import { HttpError } from 'src/api/repo/http.error';
import { $api } from 'src/api';
import { getCountries } from 'src/redux/slices/countries/countries.slice';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { Select } from '../Input/select.component';

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
    const toast = (await import('react-toastify')).toast;
    try {
      helpers.setSubmitting(true);
      const company = await $api.company.createCompany(values);
      toast.success('Organization created successfully');
      modal.resolve(company);
      setTimeout(modal.hide, 10);
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
          setTouched,
          setValues,
        } = props;
        return (
          <form
            onSubmit={handleSubmit}
            className="create-organization-form"
            autoComplete="off"
          >
            <div className="create-organization-form__section">
              <InputV2
                type="text"
                label="Company Name"
                placeholder="Company Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && errors.name}
              />
            </div>

            <div className="create-organization-form__section">
              <InputV2
                type="email"
                label="Email Address"
                placeholder="Email Address"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
              />
            </div>

            <div className="create-organization-form__section">
              <InputV2
                type="tel"
                label="Phone No."
                placeholder="Phone No."
                name="phonenumber"
                value={values.phonenumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phonenumber && errors.phonenumber}
              />
            </div>

            <div className="create-organization-form__section">
              <Select
                label="Country"
                onBlur={() => setTouched({ ...touched, country: true }, true)}
                onChange={(val: string) =>
                  setValues({ ...values, country: val }, true)
                }
                optionFilterProp="children"
                placeholder="Select Country"
                showSearch
                disabled={!countries.length}
                loading={!countries.length}
                error={(touched.country && errors.country) || ''}
              >
                {countries.map((country) => {
                  const { Option } = Select;

                  return (
                    <Option value={country.id} key={country.id}>
                      {country.name}
                    </Option>
                  );
                })}
              </Select>
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

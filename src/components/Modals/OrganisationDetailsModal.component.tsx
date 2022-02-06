import React from 'react';
import NiceModal, { NiceModalHandler } from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { Formik, FormikProps } from 'formik';
import { Input } from '../Input/Input.component';
import { Button } from '../Button/Button.component';
import { EditOrganisationDetailsValidationSchema } from 'src/helpers/validation';
import { OrganisationDetails } from '../types';
import { useAppSelector } from 'src/redux/hooks';
import { Select } from '../Input/select.component';


export const OrganisationDetailsModal = NiceModal.create(() => {
  return (
    <ModalLayout title="Edit Organisation Details">
      {(modal) => {
        return <OrganisationDetailsForm modal={modal} />;
      }}
    </ModalLayout>
  );
});

const OrganisationDetailsForm = ({ modal }: { modal: NiceModalHandler }) => {
    
  const countries = useAppSelector((state) => state.countries);
  return (
    <div>
      <Formik
        initialValues={{
          name: '',
          country: '',
          email: '',
          phonenumber: '',
        }}
        validationSchema={EditOrganisationDetailsValidationSchema}
        onSubmit={(values) => {
          modal;
          console.log(values);
        }}
      >
        {(props: FormikProps<OrganisationDetails>) => {
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
              className="organisation-detail"
              autoComplete="off"
            >
              <div className="organisation-detail__section">
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

              <div className="organisation-detail__section">
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

              <div className="organisation-detail__section">
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

              <div className="organisation-detail__section">
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
              <div className="custom-field">
                <h1>
                  <span>Salary Breakdown</span>
                </h1>
                <div>
                  <input
                    type="text"
                    name="shipping_name"
                    id="shipping_name"
                    placeholder="Basic"
                  ></input>
                  <input
                    type="text"
                    name="shipping_street"
                    id="percentage"
                    placeholder="%"
                  ></input>
                  <i className="fas fa-minus-circle fa-2x"></i>
                </div>
              </div>
              <div className="form__submit-button">
                <Button
                  type="submit"
                  label="Edit Organisation"
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
    </div>
  );
};


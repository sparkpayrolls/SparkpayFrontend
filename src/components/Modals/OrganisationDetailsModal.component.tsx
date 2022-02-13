import React, { PropsWithChildren } from 'react';
import NiceModal, { NiceModalHandler } from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { Formik } from 'formik';
import { InputV2 } from '../Input/Input.component';
import { Button } from '../Button/Button.component';
import { EditOrganisationDetailsValidationSchema } from 'src/helpers/validation';
import { Company } from 'src/api/types';
import { Util } from 'src/helpers/util';
import { NameValueInputGroup } from '../Input/name-value.component';
import { HttpError } from 'src/api/repo/http.error';
import { $api } from 'src/api';

type IOrganisationDetailsModal = PropsWithChildren<{
  organization?: Company;
}>;

export const OrganisationDetailsModal = NiceModal.create(
  (props: IOrganisationDetailsModal) => {
    return (
      <ModalLayout title="Edit Organisation Details">
        {(modal) => {
          return (
            <OrganisationDetailsForm
              modal={modal}
              organization={props.organization}
            />
          );
        }}
      </ModalLayout>
    );
  },
);

interface IOrganisationDetailsForm {
  modal: NiceModalHandler;
  organization?: Company;
}

const OrganisationDetailsForm = (props: IOrganisationDetailsForm) => {
  const { organization, modal } = props;
  const initialValues = {
    name: organization?.name,
    email: organization?.email,
    phonenumber: organization?.phonenumber,
    salaryBreakdown: organization?.salaryBreakdown || [],
    logo: organization?.logo,
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={EditOrganisationDetailsValidationSchema}
        onSubmit={async (values, helpers) => {
          const toast = (await import('react-toastify')).toast;
          try {
            helpers.setSubmitting(true);
            const { logo, salaryBreakdown, ...others } = values;
            const [data, filename] = logo?.split(':filename') || [];
            const update = {
              ...others,
              logoFile: { filename, data },
              salaryBreakdown: salaryBreakdown.map((b) => ({
                name: b.name,
                value: b.value,
              })),
            };
            if (!filename || !data) {
              // @ts-ignore
              delete update.logoFile;
            }
            const org = await $api.company.updateCompanyById(
              organization?.id || '',
              update,
            );
            modal.resolve(org);
            setTimeout(modal.hide, 10);
            toast.success('Organisation details updated successfully.');
          } catch (error) {
            const httpError = error as HttpError;
            if (httpError.status === 422) {
              helpers.setErrors({ ...httpError.errors });
              return;
            }

            toast.error(httpError.message);
          } finally {
            helpers.setSubmitting(false);
          }
        }}
      >
        {(props) => {
          const {
            handleChange,
            handleSubmit,
            handleBlur,
            values,
            errors,
            touched,
            isSubmitting,
            setValues,
            setErrors,
          } = props;
          if (!errors.salaryBreakdown) {
            const totalSalaryBreakdown = values.salaryBreakdown.reduce(
              (acc, cur) => {
                if (!+cur.value) return acc;

                return acc + +cur.value;
              },
              0,
            );
            if (totalSalaryBreakdown !== 100) {
              setErrors({
                ...errors,
                salaryBreakdown: 'Total salary breakdown should be 100%',
              });
              return null;
            }
          }

          return (
            <form
              onSubmit={handleSubmit}
              className="organisation-detail"
              autoComplete="off"
            >
              <div className="organisation-detail__section">
                <label htmlFor="logo" className="image-upload-input">
                  <input
                    type="file"
                    name="logo"
                    id="logo"
                    className="sr-only"
                    accept=".jpg,.png,.jpeg"
                    onChange={(event) => {
                      const files = event.target.files;
                      if (files) {
                        const file = files[0];
                        const reader = new FileReader();
                        reader.onload = () => {
                          setValues({
                            ...values,
                            logo: `${reader.result}:filename${file.name}`,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <span className="text__label label" role="label">
                    Logo
                  </span>
                  <div>
                    {values.logo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={values.logo.split(':filename')[0]}
                        alt="company-logo"
                      />
                    )}
                    <span
                      className="text__label placeholder"
                      role="placeholder"
                    >
                      {values.logo ? 'Change your logo' : 'Upload your logo'}
                    </span>
                  </div>
                </label>
              </div>
              <div className="organisation-detail__section">
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

              <div className="organisation-detail__section">
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

              <div className="organisation-detail__section">
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

              <div className="organisation-detail__section">
                <NameValueInputGroup
                  className="organisation-salary-breakdown"
                  label="Salary Breakdown"
                  items={values.salaryBreakdown}
                  transformValue={(v: number) => {
                    return `${(+v).toFixed(1)}%`;
                  }}
                  onChange={(e) => {
                    setValues({
                      ...values,
                      salaryBreakdown: e.target.value as any,
                    });
                  }}
                  error={errors.salaryBreakdown}
                />
              </div>
              <div className="form__submit-button">
                <Button
                  type="submit"
                  label="Save Changes"
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
    </div>
  );
};

import React, { PropsWithChildren } from 'react';
import NiceModal, { NiceModalHandler } from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { Formik } from 'formik';
import { InputV2 } from '../Input/Input.component';
import { Button } from '../Button/Button.component';
import { EditOrganisationDetailsValidationSchema } from 'src/helpers/validation';
import { Company, Country } from 'src/api/types';
import { Util } from 'src/helpers/util';
import { HttpError } from 'src/api/repo/http.error';
import { $api } from 'src/api';
import { SingleDetail } from '../Employee/single-detail.component';
import { UploadFile } from '../svg';

type IOrganisationDetailsModal = PropsWithChildren<{
  organization?: Company;
}>;

export const OrganisationDetailsModal = NiceModal.create(
  (props: IOrganisationDetailsModal) => {
    return (
      <ModalLayout title="Edit Details">
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
    country: organization?.country,
    rcnumber: organization?.rcNumber,
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
                <div
                  style={{ display: 'flex' }}
                  className="organisation-detail__flex"
                >
                  <InputV2
                    type="text"
                    label="Name"
                    placeholder="Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && errors.name}
                  />
                  <InputV2
                    type="phone"
                    label="Phone Number"
                    placeholder="phone Number"
                    name="phonenumber"
                    value={values.phonenumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phonenumber && errors.phonenumber}
                  />
                </div>
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
                  type="text"
                  label="Country"
                  placeholder="Country"
                  name="country"
                  value={(values?.country as Country)?.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.country && errors.country}
                />
              </div>
              <div className="organisation-detail__section">
                <InputV2
                  type="text"
                  label="RC Number"
                  placeholder="AP 703 321 AAA"
                  name="rcnumber"
                  value={values.rcnumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.rcnumber && errors.rcnumber}
                />
              </div>
              <div className="organisation-detail__section">
                {' '}
                <div className="info__left-cont__logo">
                  <SingleDetail
                    title="Logo"
                    details={
                      organization?.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={organization.logo} alt="company-logo" />
                      ) : (
                        'N/A'
                      )
                    }
                  />{' '}
                  <div className="info__upload">
                    <label htmlFor="logoUpload">
                      <UploadFile /> Upload Logo
                    </label>
                    <input
                      type="file"
                      id="logoUpload"
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
                  </div>
                </div>
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

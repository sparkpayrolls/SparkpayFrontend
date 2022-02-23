import React from 'react';
import NiceModal, { NiceModalHandler } from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { Formik, FormikProps } from 'formik';
import { Input } from '../Input/Input.component';
import { Button } from '../Button/Button.component';
import { addonBonusValidationSchema } from 'src/helpers/validation';
import { AddonBonus } from '../types';



export const AddonBonusModal = NiceModal.create(
  () => {
    return (
      <ModalLayout title="Create Addon Bonuses">
        {(modal) => {
          return (
            <AddonBonusForm
              modal={modal}
            />
          );
        }}
      </ModalLayout>
    );
  },
);


const AddonBonusForm = ({ modal }: { modal: NiceModalHandler }) => {
  return (
    <Formik
      initialValues={{
        oldPassword: '',
        newPassword: '',
        cycle: '',
        country: '',
        confirmPassword: '',
      }}
      validationSchema={addonBonusValidationSchema}
      onSubmit={(values) => {(modal)
        console.log(values);
      }}
    >
      {(props: FormikProps<AddonBonus>) => {
        const {
          handleChange,
          handleSubmit,
          handleBlur,
          values,
          errors,
          touched,
        } = props;
        return (
          <form
            onSubmit={handleSubmit}
            className="change-password-form"
            autoComplete="off"
          >
            <div className="change-password-form__section">
              <Input
                type="password"
                label="Old Password"
                placeholder="password"
                name="password"
                value={values.oldPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={errors.oldPassword && touched.oldPassword}
                error={errors.oldPassword}
              />
            </div>

            <div className="change-password-form__section">
              <Input
                type="password"
                label="New Password"
                placeholder="password"
                name="password"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={errors.newPassword && touched.newPassword}
                error={errors.newPassword}
              />
            </div>

            <div className="change-password-form__section">
              <Input
                type="password"
                label="Confirm New Password"
                placeholder="password"
                name="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={errors.confirmPassword && touched.confirmPassword}
                error={errors.confirmPassword}
              />
            </div>
            <div className="form__submit-button">
              <Button
                type="submit"
                label="Reset Password"
                className="form__submit-button form__submit-button--full-width"
                primary
              />
            </div>
          </form>
        );
      }}
    </Formik>
  );
};




import React from 'react';
import NiceModal, { NiceModalHandler } from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { Formik, FormikProps } from 'formik';
import { Input } from '../Input/Input.component';
import { Button } from '../Button/Button.component';
import { userChangePasswordValidationSchema } from 'src/helpers/validation';
import { ChangePasswordUserProfile } from '../types';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { HttpError } from 'src/api/repo/http.error';
import { $api } from 'src/api';
import { useAppDispatch } from 'src/redux/hooks';
import { commitUser } from 'src/redux/slices/user/user.slice';

export const ChangePasswordModal = NiceModal.create(() => {
  return (
    <ModalLayout title="Change Password">
      {(modal) => {
        return <ChangePasswordForm modal={modal} />;
      }}
    </ModalLayout>
  );
});

const ChangePasswordForm = ({ modal }: { modal: NiceModalHandler }) => {
  const dispatch = useAppDispatch();

  return (
    <Formik
      initialValues={{
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      }}
      validationSchema={userChangePasswordValidationSchema}
      onSubmit={async (values, helpers) => {
        try {
          helpers.setSubmitting(true);
          const { user, token } = await $api.auth.changePassword(
            values.oldPassword,
            values.newPassword,
          );
          Cookies.set('auth_token', token);
          dispatch(commitUser(user));
          modal.hide();
          toast.success('Password changed successfully.');
        } catch (error) {
          const err = error as HttpError;
          toast.error(err.message);
        } finally {
          helpers.setSubmitting(false);
        }
      }}
    >
      {(props: FormikProps<ChangePasswordUserProfile>) => {
        const {
          handleChange,
          handleSubmit,
          handleBlur,
          values,
          errors,
          touched,
          isSubmitting,
          setErrors,
        } = props;
        if (
          !errors.confirmPassword &&
          touched.confirmPassword &&
          values.newPassword !== values.confirmPassword
        ) {
          setErrors({
            ...errors,
            confirmPassword: 'Passwords do not match',
          });
        }
        if (
          !errors.newPassword &&
          touched.newPassword &&
          values.oldPassword &&
          values.oldPassword === values.newPassword
        ) {
          setErrors({
            ...errors,
            newPassword: 'New password cannot be the same as old password',
          });
        }

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
                name="oldPassword"
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
                name="newPassword"
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
                name="confirmPassword"
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
                className="form__submit-button form__submit-button--full-width reset-button"
                primary
                showSpinner={isSubmitting}
              />
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

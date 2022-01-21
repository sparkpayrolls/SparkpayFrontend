import React from 'react';
import { useAppSelector } from 'src/redux/hooks';
import type { NextPage } from 'next';
import Image from 'next/image';
import DashboardLayout from '../../src/layouts/dashboard-layout/DashBoardLayout';
import { Button } from '../../src/components/Button/Button.component';
import user from '../../public/svgs/user.svg';
import { Input } from '../../src/components/Input/Input.component';
import { Formik, FormikProps } from 'formik';
import { UserProfileValidationSchema } from 'src/helpers/validation';
import { userProfile } from '../../src/components/types';
import NiceModal from '@ebay/nice-modal-react';
import { ChangePasswordModal } from '@/components/Modals/UserProfileModal.component';

const UserProfile: NextPage = () => {
  const administrator = useAppSelector((state) => state.administrator);

  const onAddEmployee = () => {
    NiceModal.show(ChangePasswordModal, {
      administrator,
    });
  };
  return (
    <DashboardLayout pageTitle="Profile">
      <div className="user-profile">
        <section className="user-profile__section-container">
          <h1 className="user-profile__profile-header">Profile</h1>
          <label htmlFor="upload">
            <div className="user-profile__image-upload-link-parent">
              <Image
                src={user}
                alt="user-profileimage"
                className="user-profile__user-image"
              ></Image>
              <p className="user-profile__upload-image-text">Upload Image </p>
            </div>
          </label>
          <input
            type="file"
            id="upload"
            className="user-profile__input-upload"
          />

          <div className="user-profile__formik-section">
            <Formik
              initialValues={{
                firstname: '',
                lastname: '',
                email: '',
                phonenumber: '',
              }}
              onSubmit={(values) => {
                console.log(values);
              }}
              validationSchema={UserProfileValidationSchema}
            >
              {(props: FormikProps<userProfile>) => {
                const {
                  values,
                  touched,
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                } = props;
                return (
                  <form onSubmit={handleSubmit}>
                    <div className="user-profile__form-input-area">
                      <div className="user-profile__form-grid">
                        <Input
                          className="user-profile__input-width"
                          type="text"
                          label="First Name"
                          placeholder="First Name"
                          name="firstname"
                          value={values.firstname}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          hasError={errors.firstname && touched.firstname}
                          error={errors.firstname}
                        />

                        <Input
                          className="user-profile__input-width"
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
                      <div className="user-profile__form-grid">
                        <Input
                          className="user-profile__input-width"
                          type="email"
                          label="Email Address"
                          placeholder="Email Address"
                          name="email"
                          value={values.email}
                          loading={isSubmitting}
                          onChange={handleChange}
                          hasError={errors.email && touched.email}
                          error={errors.email}
                        />

                        <Input
                          className="user-profile__input-width"
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
                    </div>
                    <div className="user-profile__button-container">
                      <Button
                        type="submit"
                        label="Save Changes"
                        className="user-profile__button"
                        primary
                      />
                    </div>
                  </form>
                );
              }}
            </Formik>
          </div>
          <div className="user-profile__change-password-section">
            <h3 className="user-profile__password-update-text">
              Password Update
            </h3>
            <p className="user-profile__update-password">
              Update your Password
            </p>
            <div className="user-profile__change-password-container">
              <p
                className="user-profile__change-new-password"
                onClick={onAddEmployee}
              >
                Change your password to a new one
              </p>
              <p
                className="user-profile__change-password-text"
                onClick={onAddEmployee}
              >
                Change Password
              </p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;

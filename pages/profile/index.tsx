import React, { useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import DashboardLayout, {
  ImageLoader,
} from '../../src/layouts/dashboard-layout/DashBoardLayout';
import { Button } from '../../src/components/Button/Button.component';
import avatar from '../../public/svgs/user.svg';
import { Input } from '../../src/components/Input/Input.component';
import { Formik, FormikProps } from 'formik';
import { UserProfileValidationSchema } from 'src/helpers/validation';
import { IUserProfile } from '../../src/components/types';
import { HttpError } from 'src/api/repo/http.error';
import { toast } from 'react-toastify';
import { UpdateUserPayload } from 'src/api/types';
import { $api } from 'src/api';
import { Util } from 'src/helpers/util';
import { commitUser } from 'src/redux/slices/user/user.slice';

const UserProfile: NextPage = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [file, setFile] = useState({ filename: '', data: '' });

  return (
    <DashboardLayout pageTitle="Profile">
      <div className="user-profile">
        <section className="user-profile__section-container">
          <h1 className="user-profile__profile-header">Profile</h1>
          <div className="user-profile__image-upload-link-parent">
            <div className="user-profile__image-upload-link-parent__image">
              {user?.avatar || file.data ? (
                <ImageLoader
                  src={file.data || (user?.avatar as string)}
                  width={90}
                  height={90}
                />
              ) : (
                <Image
                  src={avatar}
                  alt="user-profileimage"
                  className="user-profile__user-image"
                />
              )}
            </div>
            <label htmlFor="upload" className="user-profile__upload-image-text">
              Upload Image
            </label>
          </div>
          <input
            type="file"
            id="upload"
            onChange={(event) => {
              const files = event.target.files;
              if (files) {
                const file = files[0];
                const reader = new FileReader();
                reader.onload = () => {
                  setFile({
                    filename: file.name,
                    data: reader.result as string,
                  });
                };
                reader.readAsDataURL(file);
              }
            }}
            accept=".jpg,.png,.jpeg"
            className="user-profile__input-upload"
          />

          <div className="user-profile__formik-section">
            {user && (
              <Formik
                initialValues={{
                  firstname: user.firstname,
                  lastname: user.lastname,
                  phonenumber: user.phonenumber,
                }}
                onSubmit={async (values, helpers) => {
                  try {
                    helpers.setSubmitting(true);
                    const payload: UpdateUserPayload = { ...values };
                    if (file.filename && file.data) {
                      payload.avatarFile = file;
                    }
                    const user = await $api.user.updateProfile(payload);
                    dispatch(commitUser(user));
                    setFile({ filename: '', data: '' });
                    toast.success('Changes saved successfully.');
                  } catch (error) {
                    const err = error as HttpError;
                    toast.error(err.message);
                  } finally {
                    helpers.setSubmitting(false);
                  }
                }}
                validationSchema={UserProfileValidationSchema}
              >
                {(props: FormikProps<IUserProfile>) => {
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
                            readOnly
                            value={user.email}
                            onChange={() => {}}
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
                          disabled={
                            !file.filename && Util.deepEquals(values, user)
                          }
                          showSpinner={isSubmitting}
                          label="Save Changes"
                          className="user-profile__button"
                          primary
                        />
                      </div>
                    </form>
                  );
                }}
              </Formik>
            )}
          </div>
          <div className="user-profile__change-password-section">
            <h3 className="user-profile__password-update-text">
              Password Update
            </h3>
            <p className="user-profile__update-password">
              Update your Password
            </p>
            <div className="user-profile__change-password-container">
              <p className="user-profile__change-new-password">
                Change your password to a new one
              </p>
              <p className="user-profile__change-password-text">
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

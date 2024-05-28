import { FormikErrors, FormikHelpers } from 'formik';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { getCountries } from 'src/redux/slices/countries/countries.slice';
import { commitUser } from 'src/redux/slices/user/user.slice';
import { Util } from '../util';
import { stringifyUrl } from 'query-string';

interface ISignUpForm {
  firstname: string;
  lastname: string;
  country: string;
  email: string;
  password: string;
  subcribeToMailList: boolean;
}

export const useCreateAccountPageContext = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, countries } = useAppSelector((state) => state);
  const inviteCode = router.query.inviteCode as string;
  const goto = router.query.goto as string;

  React.useEffect(() => {
    getCountries(dispatch);
  }, [dispatch]);

  if (user && typeof window !== 'undefined') {
    router.replace(goto ? goto : '/overview');
    return null;
  }

  const validateEmail = Util.debounce(async (
    email: string,
    // eslint-disable-next-line no-unused-vars
    setErrors: (errors: FormikErrors<ISignUpForm>) => void,
    setSubmitting: (_isSubmitting: boolean) => void,
  ) => {
    setSubmitting(true);
    try {
      if (email) {
        const isTaken = await $api.auth.emailTaken(email);
        if (isTaken) {
          setErrors({ email: 'email already taken' });
        }
      }
    } catch (error: any) {
      // error validating email
    } finally {
      setSubmitting(false);
    }
  }, 500);

  const onSubmit = async (
    values: ISignUpForm,
    actions: FormikHelpers<ISignUpForm>,
  ) => {
    try {
      actions.setSubmitting(true);
      const { user, ...authDetails } = await $api.auth.signup({
        ...values,
        inviteCode,
      });
      Cookies.set('auth_token', authDetails.accessToken);
      Cookies.set('auth_details', JSON.stringify(authDetails));
      $api.registerInterceptors(authDetails.accessToken, dispatch);
      dispatch(commitUser(user));
    } catch (error) {
      const err = error as HttpError;
      if (err.status === 422) {
        actions.setErrors(err.errors);
        return;
      }
      if (err.status === 409) {
        actions.setErrors({ email: err.message });
        return;
      }
      toast.error(`${err.message}`);
    } finally {
      actions.setSubmitting(false);
    }
  };
  if (!router.isReady && typeof window !== 'undefined') {
    return null;
  }

  const initialValues: ISignUpForm = {
    firstname: '',
    lastname: '',
    country: '',
    email: '',
    password: '',
    subcribeToMailList: true,
  };

  return {
    countries,
    initialValues,
    onSubmit,
    validateEmail,
    loginUrl: stringifyUrl({
      url: 'login',
      query: router.query,
    }),
  };
};

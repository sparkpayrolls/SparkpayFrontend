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

interface ISignUpForm {
  firstname: string;
  lastname: string;
  country: string;
  email: string;
  password: string;
  inviteCode: string;
  subcribeToMailList: boolean;
}

export const useCreateAccountPageContext = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, countries } = useAppSelector((state) => state);
  const [inviteCodeValid, setInviteCodeValid] = React.useState({
    loading: false,
    valid: false,
    details: { name: '', email: '' },
  });

  React.useEffect(() => {
    getCountries(dispatch);
  }, [dispatch]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validateInviteCode = React.useCallback(
    Util.debounce(async (code) => {
      try {
        setInviteCodeValid((i) => ({ ...i, loading: true }));
        const details = await $api.auth.validateInviteCode(code);
        setInviteCodeValid((i) => ({ ...i, valid: true, details }));
      } catch (error) {
        setInviteCodeValid((i) => ({
          ...i,
          valid: false,
          details: { email: '', name: '' },
        }));
      } finally {
        setInviteCodeValid((i) => ({ ...i, loading: false }));
      }
    }, 500),
    [],
  );

  React.useEffect(() => {
    if (router.isReady) {
      validateInviteCode(router.query.inviteCode as string);
    }
  }, [router, validateInviteCode]);

  if (user) {
    router.replace('/overview');
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
      const { user, token } = await $api.auth.signup(values);
      Cookies.set('auth_token', token);
      $api.registerInterceptors(token, dispatch);
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
  if (!router.isReady) {
    return null;
  }

  const [firstname, ...lastname] = inviteCodeValid.details.name.split(' ');
  const initialValues: ISignUpForm = {
    firstname: firstname,
    lastname: lastname.join(' '),
    country: '',
    email: inviteCodeValid.details.email,
    password: '',
    inviteCode: (router.query.inviteCode as string) || '',
    subcribeToMailList: true,
  };

  return {
    countries,
    initialValues,
    firstname,
    inviteCodeValid,
    lastname,
    router,
    onSubmit,
    validateEmail,
  };
};

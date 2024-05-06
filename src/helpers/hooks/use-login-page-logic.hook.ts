import { FormikHelpers } from 'formik';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { getCurrentAdministrator } from 'src/redux/slices/administrator/administrator.slice';
import { refreshCompanies } from 'src/redux/slices/companies/companies.slice';
import { commitUser } from 'src/redux/slices/user/user.slice';

export const useLoginPageLogic = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state);

  if (!router.isReady && typeof window !== 'undefined') {
    return null;
  }

  const initialValues = { email: '', password: '' };
  const goto = router.query.goto as string;
  const isLoggedIn = !!user;
  if (isLoggedIn) {
    router.replace(goto ? goto : '/overview');
    return null;
  }

  const onSubmit = async (
    values: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>,
  ) => {
    try {
      actions.setSubmitting(true);

      const { email: username, password } = values;
      const { user, ...authDetails } = await $api.auth.login(
        username,
        password,
      );
      Cookies.set('auth_token', authDetails.accessToken);
      Cookies.set('auth_details', JSON.stringify(authDetails));
      $api.registerInterceptors(authDetails.accessToken, dispatch);
      await Promise.all([
        refreshCompanies(dispatch),
        getCurrentAdministrator(dispatch),
      ]);
      dispatch(commitUser(user));
    } catch (error: any) {
      toast.error(error.message, { delay: 1000 });
    } finally {
      actions.setSubmitting(false);
    }
  };

  return { initialValues, onSubmit };
};

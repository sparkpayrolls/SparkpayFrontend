import { FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { Util } from '../util';

export const useRequestAccessPageLogic = () => {
  const router = useRouter();
  const initialValues = { email: '', name: '' };
  const onSubmit = async (
    values: typeof initialValues,
    helpers: FormikHelpers<typeof initialValues>,
  ) => {
    try {
      helpers.setSubmitting(true);
      await $api.auth.requestAccess(values);
      router.replace('/request-received');
    } catch (error) {
      Util.onNonAuthError(error, (err) => {
        if (err.status === 422) {
          helpers.setErrors(err.errors);
          return;
        }

        toast.error(err.message);
      });
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return { initialValues, router, onSubmit };
};

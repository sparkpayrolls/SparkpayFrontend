import { FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';

export const useBookDemoPageContext = () => {
  const router = useRouter();
  if (!router.isReady && typeof window !== 'undefined') {
    return null;
  }

  const initialValues = {
    firstname: '',
    lastname: '',
    email: '',
    phonenumber: '',
    company: '',
    employeeSize: '',
  };

  const handleSubmit = async (
    values: typeof initialValues,
    helpers: FormikHelpers<typeof initialValues>,
  ) => {
    try {
      helpers.setSubmitting(true);
      await $api.auth.bookDemo(values);
      toast.success('Successful');
      router.replace('/');
    } catch (error) {
      const err = error as HttpError;
      if (err.status === 422) {
        helpers.setErrors(err.errors);
        return;
      }
      toast.error(`${err.message}`);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return {
    handleSubmit,
    initialValues,
  };
};

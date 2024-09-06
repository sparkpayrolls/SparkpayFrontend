import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { TaxTabProps } from './tax-tab';
import { FormikHelpers } from 'formik';
import { omit } from 'lodash';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';

export const useRemittanceInformationContext = () => {
  const router = useRouter();
  const { tab } = router.query;

  const onTabChange = (tab: string) => {
    const { pathname, query } = router;
    const url = stringifyUrl({
      url: pathname,
      query: { ...query, tab },
    });

    router.push(url);
  };

  const selectedTab = Array.isArray(tab) ? tab[0] : tab || 'tax';

  return {
    selectedTab,
    onTabChange,
  };
};

export const useTaxTabContext = (props: TaxTabProps) => {
  const taxSettings =
    props.organizationDetails.organization?.statutoryDeductions?.tax;
  const initialValues = {
    status: taxSettings?.enabled ? 'Enabled' : 'Disabled',
    taxId: (taxSettings?.taxId || '').toString(),
    taxState: (taxSettings?.taxState || '').toString(),
    taxRate: (taxSettings?.taxRate || 0.05).toString(),
    taxType: (taxSettings?.taxType || 'paye').toString(),
    healthRelief: (taxSettings?.healthRelief || 0).toString(),
  };
  if (taxSettings?.addToCharge) {
    initialValues.status = 'Remit';
  }

  const handleSubmit = async (
    values: typeof initialValues,
    helpers: FormikHelpers<typeof initialValues>,
  ) => {
    const toast = (await import('react-toastify')).toast;
    helpers.setSubmitting(true);
    try {
      if (!props.organizationDetails.canEdit) {
        return;
      }
      const update = {
        statutoryDeductions: {
          ...(props.organizationDetails.organization?.statutoryDeductions ||
            {}),
          tax: {
            ...omit(values, ['status']),
            enabled: ['Enabled', 'Remit'].includes(values.status),
            addToCharge: values.status === 'Remit',
          },
        },
      };

      await $api.company.updateCompanyById(
        props.organizationDetails.organization?.id || '',
        update,
      );
      toast.success('Remittance details updated successfully.');
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
  };

  return { initialValues, handleSubmit };
};

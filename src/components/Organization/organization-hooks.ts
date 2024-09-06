import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { FormikHelpers } from 'formik';
import { omit } from 'lodash';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { RemittanceTabProps } from './types';

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

export const useRemittanceTabContext = (
  props: RemittanceTabProps,
  remittance = 'tax',
) => {
  const settings =
    props.organizationDetails.organization?.statutoryDeductions?.[remittance];
  let initialValues: Record<string, string> = {
    status: settings?.enabled ? 'Enabled' : 'Disabled',
  };
  if (remittance === 'tax') {
    initialValues = {
      ...initialValues,
      taxId: (settings?.taxId || '').toString(),
      taxState: (settings?.taxState || '').toString(),
      taxRate: (settings?.taxRate || 0.05).toString(),
      taxType: (settings?.taxType || 'paye').toString(),
      healthRelief: (settings?.healthRelief || 0).toString(),
    };
  }

  if (remittance === 'nhf') {
    initialValues = {
      ...initialValues,
      nhfId: (settings?.nhfId || '').toString(),
    };
  }

  if (remittance === 'pension') {
    initialValues = {
      ...initialValues,
      pensionId: (settings?.pensionId || '').toString(),
      pensionType: (settings?.pensionType || 'deduct').toString(),
      pfa: (settings?.pfa || '').toString(),
    };
  }

  if (settings?.addToCharge) {
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
          [remittance]: {
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

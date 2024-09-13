import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { FormikHelpers } from 'formik';
import { omit } from 'lodash';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { RemittanceTabProps } from './types';
import { SalaryBreakdown } from 'src/api/types';
import cloneDeep from 'lodash.clonedeep';
import { useState } from 'react';

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
  const settings: Record<string, string> = props.organizationDetails
    .organization?.statutoryDeductions?.[remittance] as Record<string, string>;
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

export const useSalaryBreakdownContext = (props: RemittanceTabProps) => {
  const { organization, loading, canEdit } = props.organizationDetails;
  const [breakdown, setBreakdown] = useState(
    organization?.salaryBreakdown || [],
  );
  const [saving, setSaving] = useState(false);
  const [edit, setEdit] = useState(false);
  const colors = ['#0B2253', '#6D7A98', '#42D0C8'];
  const chartValues: number[] = [];
  const chartLabels: string[] = [];
  const backgroundColors: string[] = [];
  const _breakdown = breakdown.filter(
    (b) => b.name && Number.isFinite(b.value),
  );
  const canSave =
    _breakdown.length &&
    _breakdown.reduce((a, c) => a + c.value, 0) === 100 &&
    (!organization?.salaryBreakdown?.length ||
      cloneDeep(_breakdown)
        .reverse()
        .some((b) => {
          return (
            organization?.salaryBreakdown?.findIndex(
              (_b) => b.name === _b.name && b.value === _b.value,
            ) === -1
          );
        }));

  _breakdown.forEach((b, i) => {
    chartLabels.push(b.name);
    chartValues.push(b.value);
    backgroundColors.push(colors[i % 3]);
  });

  const addBreakdown = () => {
    setBreakdown(_breakdown.concat({ name: '', value: 0 }));
  };

  const handleBreakdown = (i: number) => {
    return (val: Record<string, unknown>) => {
      const b = cloneDeep(breakdown);

      b[i] = val as SalaryBreakdown;
      setBreakdown(b);
    };
  };

  const handleBreakdownDelete = (i: number) => {
    return () => {
      const b = cloneDeep(breakdown);
      b.splice(i, 1);

      setBreakdown(b);
    };
  };

  const savBreakdown = async () => {
    if (!props.organizationDetails.canEdit) {
      return;
    }
    setSaving(true);
    const toast = (await import('react-toastify')).toast;
    try {
      await $api.company.updateCompanyById(
        props.organizationDetails.organization?.id || '',
        { salaryBreakdown: _breakdown },
      );
      toast.success('Salary Breakdown updated successfully.');
    } catch (error) {
      const httpError = error as HttpError;

      toast.error(httpError.errors.salaryBreakdown || httpError.message);
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    canEdit,
    saving,
    edit,
    setEdit,
    canSave,
    addBreakdown,
    handleBreakdown,
    handleBreakdownDelete,
    savBreakdown,
    breakdown,
    organization,
    chartLabels,
    chartValues,
    backgroundColors,
    _breakdown,
  };
};

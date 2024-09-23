import { FormikHelpers } from 'formik';
import { omit } from 'lodash';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { RemittanceTabProps } from './types';
import { PaginateParams, SalaryBreakdown } from 'src/api/types';
import cloneDeep from 'lodash.clonedeep';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Util } from 'src/helpers/util';
import { useAppSelector } from 'src/redux/hooks';
import _isEmpty from 'lodash.isempty';
import pick from 'lodash.pick';

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
  const totalBreakDown = _breakdown.reduce((a, c) => a + c.value, 0);
  const canSave =
    _breakdown.length &&
    totalBreakDown === 100 &&
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
        { salaryBreakdown: _breakdown.map((b) => pick(b, ['name', 'value'])) },
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
    totalBreakDown,
  };
};

export const useRemittanceEmployeesTabContext = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const [params, setParams] = useState<PaginateParams>({});
  // eslint-disable-next-line no-undef
  const [data, setData] = useState<Awaited<
    ReturnType<typeof $api.payroll.getRemittanceEmployees>
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [employeeLoading, setEmployeeLoading] = useState<
    Record<string, boolean>
  >({});
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const isEmpty = (data?.meta?.total || 0) <= 0;

  const getEmployees = useCallback(() => {
    setLoading(true);
    return $api.payroll
      .getRemittanceEmployees(params)
      .then(setData)
      .catch((error) => {
        Util.onNonAuthError(error, (httpError) => {
          toast.error(httpError.message);
        });
      })
      .finally(() => setLoading(false));
  }, [params]);
  const handleSearch = (search: string) => {
    setParams({ ...params, search });
  };
  const startLoadingEmployee = (employee: string) => {
    setEmployeeLoading((e) => ({ ...e, [employee]: true }));

    return () => {
      setEmployeeLoading((e) => ({ ...e, [employee]: false }));
    };
  };
  const updateEmployee = (
    // @ts-ignore
    employee: typeof data.data.employees[0],
    shouldRefresh = false,
    skipIfEmpty = false,
  ) => {
    return (ev: any) => {
      console.log({ skipIfEmpty, value: ev.target.values });
      if (
        ev.target.value === employee[ev.target.name as 'taxId'] ||
        (skipIfEmpty && _isEmpty(ev.target.value))
      ) {
        return;
      }
      const stopLoadingEmployee = startLoadingEmployee(
        `${employee.id}_${ev.target.name}`,
      );

      return $api.employee
        .updateSingleEmployee(employee.id, {
          [ev.target.name]: ev.target.value,
        })
        .then(() => {
          if (shouldRefresh) {
            return getEmployees();
          }
        })
        .catch(() => {
          toast.error('Error updating employee tax details');
        })
        .finally(stopLoadingEmployee);
    };
  };
  const updateStatus = (
    // @ts-ignore
    employee: typeof data.data.employees[0],
    remittance = 'tax',
  ) => {
    return (enabled: boolean) => {
      updateEmployee(
        employee,
        true,
      )({
        target: {
          name: 'statutoryDeductions',
          value: {
            ...(employee.statutoryDeductions || {}),
            [remittance]: {
              ...((employee.statutoryDeductions || {})[remittance] || {}),
              enabled,
            },
          },
        },
      });
    };
  };

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  return {
    updateStatus,
    updateEmployee,
    handleSearch,
    isEmpty,
    currency,
    employeeLoading,
    loading,
    data,
    setParams,
  };
};

import { confirmation } from '@/components/Modals/ConfirmationModal.component';
import moment from 'antd/node_modules/moment';
import { FormikHelpers } from 'formik';
import pick from 'lodash.pick';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { Addon, Remittance, EnabledRemittance } from 'src/api/types';
import { Util } from '../util';

export type IEditPayrollEmployeeModalParams = {
  currency: string;
  salary: string;
  name: string;
  employee: string;
  hook(): unknown;
  addons: Addon[];
  payrollCycle: string;
  year: string;
  month: string;
  onCustomAddon(_addon: Record<string, unknown>[]): unknown;
  loadingPayroll: boolean;
  remittances: Remittance[];
  enabledRemittances: EnabledRemittance[];
};

type IUpdateSalaryValues = {
  salary: string;
};

type RangeValue<T> = [T, T];

type IuseUpdatePayrollEmployeeAddonFormLogic = {
  year: string;
  month: string;
  setValues(
    _values: Record<string, unknown>,
    _shouldValidate?: boolean,
  ): unknown;
  values: Record<string, unknown>;
};

type IuseEditPayrollEmployeeModalLogic = {
  getParams(): IEditPayrollEmployeeModalParams;
  paramUpdateRef(
    _ref: ((_param: IEditPayrollEmployeeModalParams) => unknown) | null,
  ): unknown;
};

type IonDeleteAddon = {
  addon: Addon;
  addons: Addon[];
  onCustomAddon(_addons: Addon[]): unknown;
  month: string;
  year: string;
  hook(): unknown;
};

type IonSubmitAddon = {
  onCustomAddon(_addons: Addon[]): unknown;
  hook(): unknown;
  employee: string;
  addons: Addon[];
};

type IonSubmitSalary = {
  employee: string;
  hook(): unknown;
};

type IonToggleRemittance = {
  name: string;
  employee: string;
  hook(): unknown;
};

type IonSelectGroup = {
  name: string;
  employee: string;
  hook(): unknown;
};

type IonClearGroup = {
  name: string;
  employee: string;
  hook(): unknown;
  groupId: string;
};

export const useUpdatePayrollEmployeeAddonFormHandlers = (
  param: IuseUpdatePayrollEmployeeAddonFormLogic,
) => {
  const { year, month, setValues, values } = param;
  const type = values.type as string;
  const dates = values.dates as any[];
  const period = moment()
    .year(+year)
    .month(month);
  let prorateDates: RangeValue<moment.Moment> = [
    period.clone().startOf('month'),
    period,
  ];
  const handleTypeChange = (v: string) => {
    const [start, end] = prorateDates;
    setValues(
      {
        ...values,
        type: v,
        dates:
          v === 'prorate'
            ? [
                {
                  month: period.format('MMMM'),
                  year: period.format('YYYY'),
                  days: [start.format('DD'), end.format('DD')],
                },
              ]
            : values.dates,
      },
      true,
    );
  };
  const handleDatesChange = (value: RangeValue<moment.Moment> | null) => {
    if (!value) {
      setValues({ ...values, dates: [] });
      return;
    }

    let [start, end] = value;
    if (+start.format('DD') > +end.format('DD')) {
      [start, end] = [end, start];
    }

    setValues({
      ...values,
      dates: [
        {
          month: period.format('MMMM'),
          year: period.format('YYYY'),
          days: [start.format('DD'), end.format('DD')],
        },
      ],
    });
  };
  if (type === 'prorate' && dates.length) {
    const [date] = dates;
    const [start, end] = date?.days || [
      prorateDates[0].format('DD'),
      prorateDates[1].format('DD'),
    ];
    const format = period.format('YYYY-MM-');
    prorateDates = [moment(`${format}${start}`), moment(`${format}${end}`)];
  }

  return { handleTypeChange, handleDatesChange, prorateDates };
};

export const useEditPayrollEmployeeModalLogic = (
  props: IuseEditPayrollEmployeeModalLogic,
) => {
  const { getParams, paramUpdateRef } = props;
  const [params, setParams] = useState<IEditPayrollEmployeeModalParams | null>(
    null,
  );
  const [addon, setAddon] = useState<Addon | null>(null);

  useEffect(() => {
    setParams(getParams());

    return () => {
      setParams(null);
    };
  }, [getParams]);

  useEffect(() => {
    paramUpdateRef((params) => {
      setParams(params);
    });

    return () => {
      paramUpdateRef(null);
    };
  }, [paramUpdateRef]);

  const onEditAddon = (addon: Addon) => {
    return () => {
      setAddon(addon);
    };
  };

  const omitAddon = (addons: Addon[], addon: Addon) => {
    return addons.filter((a) => a.customAddonIndex !== addon.customAddonIndex);
  };

  const onDeleteAddon = (payload: IonDeleteAddon) => {
    const { addon, addons, onCustomAddon, month, year, hook } = payload;

    return async () => {
      const shouldDelete = await confirmation({
        title: 'Delete Addon',
        text: 'Are you sure you want to permanently delete this Addon?',
      });
      if (shouldDelete) {
        if (addon.customAddonIndex) {
          const _addons = omitAddon(addons, addon);
          onCustomAddon(_addons);
        }
        if (addon.addonId) {
          $api.payroll
            .deletePayrollSalaryAddon({
              addOnId: addon.addonId as string,
              proRateMonth: month,
              year: +year,
            })
            .then(hook)
            .catch((error) => {
              Util.onNonAuthError(error, (httpError) =>
                toast.error(httpError.message),
              );
            });
        }
      }
    };
  };

  const onSubmitAddon = (payload: IonSubmitAddon) => {
    const { employee, addons, onCustomAddon, hook } = payload;

    return async (values: Addon, helpers: FormikHelpers<Addon>) => {
      try {
        helpers.setSubmitting(true);
        const customAddon = (pick(
          {
            ...values,
            entity: employee,
            customAddonIndex: addons.length + 1,
          },
          ['type', 'name', 'amount', 'entity', 'dates', 'customAddonIndex'],
        ) as unknown) as Addon;
        if (values.customAddonIndex) {
          const _addons = omitAddon(addons, values);
          onCustomAddon([..._addons, customAddon]);
        } else if (values.addonId) {
          const update = pick(values, [
            'amount',
            'name',
            'type',
            'addonId',
            'dates',
          ]) as Addon;
          await $api.payroll.updatePayrollSalaryAddon(update);
          hook();
        } else {
          onCustomAddon([...addons, customAddon]);
        }
        helpers.resetForm();
        setAddon(null);
      } catch (error) {
        Util.onNonAuthError(error, (httpError) => {
          if (httpError.status === 422) {
            helpers.setErrors(httpError.errors);
            return;
          }
          toast.error(httpError.message);
        });
      } finally {
        helpers.setSubmitting(false);
      }
    };
  };

  const onSubmitSalary = (payload: IonSubmitSalary) => {
    const { employee, hook } = payload;

    return async (
      values: IUpdateSalaryValues,
      helpers: FormikHelpers<IUpdateSalaryValues>,
    ) => {
      try {
        helpers.setSubmitting(true);
        await $api.payroll.updateEmployeeSalary(employee, values.salary);
        toast.success('Salary updated successfully');
        hook();
      } catch (error) {
        Util.onNonAuthError(error, (httpError) => {
          if (httpError.status === 422) {
            helpers.setErrors(httpError.errors);
            return;
          }
          toast.error(httpError.message);
        });
      } finally {
        helpers.setSubmitting(false);
      }
    };
  };

  const onToggleRemittance = (param: IonToggleRemittance) => {
    const { name, hook, employee } = param;

    return async (value: boolean) => {
      try {
        const payload = {
          remittanceName: name,
          employee,
        };
        if (value) {
          await $api.payroll.addToRemittance(payload);
        } else {
          await $api.payroll.removeFromRemittance(payload);
        }
        hook();
      } catch (error) {
        Util.onNonAuthError(error, (httpError) => {
          toast.error(httpError.message);
        });
      }
    };
  };

  const onSelectGroup = (payload: IonSelectGroup) => {
    const { name, employee, hook } = payload;

    return async (groupId: string) => {
      try {
        await $api.payroll.addToRemittanceGroup({
          remittanceName: name,
          employee,
          groupId,
        });
        hook();
      } catch (error) {
        Util.onNonAuthError(error, (httpError) => {
          toast.error(httpError.message);
        });
      }
    };
  };

  const onClearGroup = (param: IonClearGroup) => {
    const { hook, employee, name, groupId } = param;

    return async () => {
      try {
        await $api.payroll.removeFromRemittanceGroup({
          remittanceName: name,
          employee,
          groupId,
        });
        hook();
      } catch (error) {
        Util.onNonAuthError(error, (httpError) => {
          toast.error(httpError.message);
        });
      }
    };
  };

  return {
    params,
    addon,
    onEditAddon,
    omitAddon,
    setAddon,
    onDeleteAddon,
    onSubmitAddon,
    onSubmitSalary,
    onToggleRemittance,
    onSelectGroup,
    onClearGroup,
  };
};

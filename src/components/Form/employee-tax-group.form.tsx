import { Formik } from 'formik';
import pick from 'lodash.pick';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import {
  Group,
  NigerianTaxGroupMeta,
  SalaryBreakdown,
  State,
} from 'src/api/types';
import { Util } from 'src/helpers/util';
import { EmployeeTaxGroupValidation } from 'src/helpers/validation';
import { useAppSelector } from 'src/redux/hooks';
import { Button } from '../Button/Button.component';
import { InputV2, TextArea } from '../Input/Input.component';
import { NameValueInputGroup } from '../Input/name-value.component';
import { Select } from '../Input/select.component';

interface IEmployeeTaxGroupForm {
  id?: string;
  initialValues?: {
    name: string;
    description?: string;
    meta: NigerianTaxGroupMeta;
  };
  // eslint-disable-next-line no-unused-vars
  onDone?(group: Group): any;
}

export const EmployeeTaxGroupForm = (props: IEmployeeTaxGroupForm) => {
  const {
    initialValues = {
      name: '',
      description: '',
      meta: {
        salaryBreakdown: [],
        customTaxRelief: [],
      } as NigerianTaxGroupMeta,
    },
    id,
    onDone,
  } = props;
  const [states, setStates] = useState<State[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const administrator = useAppSelector((state) => state.administrator);
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);

  const getStates = useCallback(async () => {
    try {
      setLoadingStates(true);
      const { data } = await $api.remittance.nigeria.tax.getTaxStates({
        all: true,
      });

      setStates(data);
    } catch (error) {
      Util.onNonAuthError(error, (httpError) => {
        toast.error(httpError.message);
      });
    } finally {
      setLoadingStates(false);
    }
  }, []);

  useEffect(() => {
    getStates();
  }, [getStates]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, helpers) => {
        try {
          helpers.setSubmitting(true);
          let data: Group<NigerianTaxGroupMeta>;
          if (!values.meta.salaryBreakdown?.length) {
            delete values.meta.salaryBreakdown;
          }
          if (!values.meta.customTaxRelief?.length) {
            delete values.meta.customTaxRelief;
          }
          if (id) {
            data = await $api.remittance.nigeria.tax.updateTaxGroup(
              id,
              pick(values, ['name', 'description', 'meta']),
            );
            toast.success('Tax group updated');
          } else {
            data = await $api.remittance.nigeria.tax.createTaxGroup(values);
            toast.success('Tax group created');
          }
          if (onDone) {
            onDone(data);
          }
        } catch (error) {
          const httpError = error as HttpError;
          if (![401, 403].includes(httpError.status)) {
            if (httpError.status === 422) {
              helpers.setErrors(httpError.errors);
              return;
            }

            toast.error(httpError.message);
          }
        } finally {
          helpers.setSubmitting(false);
        }
      }}
      validationSchema={EmployeeTaxGroupValidation}
    >
      {(props) => {
        const {
          handleSubmit,
          touched,
          errors,
          values,
          handleBlur,
          handleChange,
          isSubmitting,
          setValues,
        } = props;
        if (!values.meta) {
          values.meta = {};
        }

        return (
          <form onSubmit={handleSubmit} className="employee-group-form">
            <InputV2
              placeholder="Group Name"
              name="name"
              label="Group Name"
              id="group_name"
              labelFor="group_name"
              error={touched.name && errors.name}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
            />
            <TextArea
              labelFor="group_description"
              name="description"
              id="group_description"
              placeholder="Group Description"
              label="Group Description"
              error={touched.description && errors.description}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.description}
            />
            <InputV2
              placeholder="Tax ID"
              name="meta.taxId"
              label="Tax ID"
              id="taxId"
              labelFor="taxId"
              error={touched.meta?.taxId && errors.meta?.taxId}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.meta.taxId}
            />
            {!loadingStates && (
              <Select
                loading={loadingStates}
                onChange={(v) => {
                  setValues({
                    ...values,
                    meta: { ...values.meta, taxState: v as string },
                  });
                }}
                defaultValue={values.meta?.taxState}
                label="Tax State"
                showSearch
                optionFilterProp="children"
                placeholder="Tax State"
                error={(touched.meta?.taxState && errors.meta?.taxState) || ''}
              >
                {states.map((state) => {
                  const { Option } = Select;

                  return (
                    <Option key={state.id} value={state.id}>
                      {state.name}
                    </Option>
                  );
                })}
              </Select>
            )}
            <InputV2
              placeholder="Tax Office"
              name="meta.taxOffice"
              label="Tax Office"
              id="taxOffice"
              labelFor="taxOffice"
              error={touched.meta?.taxOffice && errors.meta?.taxOffice}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.meta.taxOffice}
            />
            <Select
              placeholder="Tax Type"
              label="Tax Type"
              options={[
                { value: 'PAYE', label: 'PAYE' },
                { value: 'WITHHOLDING', label: 'Withholding' },
              ]}
              value={values.meta.type}
              onChange={(v) => {
                setValues({ ...values, meta: { ...values.meta, type: v } });
              }}
              error={(touched.meta?.type && errors.meta?.type) || ''}
            />
            {values.meta.type === 'WITHHOLDING' && (
              <InputV2
                placeholder="Withholding Tax Rate"
                name="meta.whTaxRate"
                label="Withholding Tax Rate"
                id="whTaxRate"
                labelFor="whTaxRate"
                error={touched.meta?.whTaxRate && errors.meta?.whTaxRate}
                onChange={(event) => {
                  event.target.value = (+event.target.value / 100).toFixed(2);
                  handleChange(event);
                }}
                onBlur={handleBlur}
                type="number"
                transformValue={(val) => `${val}%`}
                value={(values.meta.whTaxRate || 0) * 100}
              />
            )}
            <Select
              placeholder="Status"
              label="Status"
              options={[
                { value: 'Disabled', label: 'Disabled' },
                { value: 'Calculate', label: 'Calculate' },
                { value: 'Deduct', label: 'Deduct' },
                { value: 'Remit', label: 'Remit' },
              ]}
              value={values.meta.status}
              onChange={(v) => {
                setValues({ ...values, meta: { ...values.meta, status: v } });
              }}
              error={(touched.meta?.status && errors.meta?.status) || ''}
            />
            <NameValueInputGroup
              label="Salary Breakdown"
              items={values.meta.salaryBreakdown || []}
              onChange={(e) => {
                const salaryBreakdown = e.target.value as SalaryBreakdown[];
                setValues({
                  ...values,
                  meta: { ...values.meta, salaryBreakdown },
                });
              }}
              transformValue={(v: number) => {
                return `${v}%`;
              }}
              error={errors.meta?.salaryBreakdown}
              helper={
                !values.meta.salaryBreakdown ||
                !values.meta.salaryBreakdown.length
                  ? 'Using company salary breakdown'
                  : 'Leaving out basic will default it to 100%'
              }
            />
            <NameValueInputGroup
              label="Custom tax relief items"
              items={
                values.meta.customTaxRelief?.map((c) => ({
                  ...c,
                  value: c.amount,
                })) || []
              }
              onChange={(e) => {
                const customTaxRelief = e.target.value.map((v) => ({
                  amount: v.value as number,
                  name: v.name,
                }));
                setValues({
                  ...values,
                  meta: { ...values.meta, customTaxRelief },
                });
              }}
              transformValue={(v: number) => {
                return `${currency} ${Util.formatMoneyNumber(+v || 0)}`;
              }}
              error={errors.meta?.customTaxRelief}
            />
            <Button
              label={id ? 'Save Group' : 'Create Group'}
              type="submit"
              primary
              disabled={isSubmitting || Util.deepEquals(values, initialValues)}
              showSpinner={isSubmitting}
            />
          </form>
        );
      }}
    </Formik>
  );
};

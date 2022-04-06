import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { HttpError } from 'src/api/repo/http.error';
import { CustomTaxRelief, Group, SalaryBreakdown } from 'src/api/types';
import { Util } from 'src/helpers/util';
import { EmployeeTaxGroupValidation } from 'src/helpers/validation';
import { useAppSelector } from 'src/redux/hooks';
import { Button } from '../Button/Button.component';
import { InputV2, TextArea } from '../Input/Input.component';
import { NameValueInputGroup } from '../Input/name-value.component';

interface IEmployeeTaxGroupForm {
  id?: string;
  initialValues?: {
    name: string;
    description?: string;
    salaryBreakdown?: SalaryBreakdown[];
    customTaxRelief?: CustomTaxRelief[];
  };
  // eslint-disable-next-line no-unused-vars
  onDone?(group: Group): any;
}

export const EmployeeTaxGroupForm = (props: IEmployeeTaxGroupForm) => {
  const {
    initialValues = {
      name: '',
      description: '',
      salaryBreakdown: [],
      customTaxRelief: [],
    },
    id,
    onDone,
  } = props;
  const administrator = useAppSelector((state) => state.administrator);
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, helpers) => {
        try {
          helpers.setSubmitting(true);
          // let data: Group;
          if (id) {
            // edit tax group
            // data = await $api.[id]
            console.log('edit group', values);
          } else {
            // create tax group
            // data = await $api.[]
            console.log('create group', values);
          }
          if (onDone) {
            onDone(values as any);
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
            <NameValueInputGroup
              label="Salary Breakdown"
              items={values.salaryBreakdown || []}
              onChange={(e) => {
                const salaryBreakdown = e.target.value as SalaryBreakdown[];
                setValues({ ...values, salaryBreakdown });
              }}
              transformValue={(v: number) => {
                return `${v}%`;
              }}
              error={errors.salaryBreakdown}
              helper={
                !values.salaryBreakdown || !values.salaryBreakdown.length
                  ? 'Using company salary breakdown'
                  : 'Leaving out basic will default it to 100%'
              }
            />
            <NameValueInputGroup
              label="Custom tax relief items"
              items={
                values.customTaxRelief?.map((c) => ({
                  ...c,
                  value: c.amount,
                })) || []
              }
              onChange={(e) => {
                const customTaxRelief = e.target.value.map((v) => ({
                  amount: v.value as number,
                  name: v.name,
                }));
                setValues({ ...values, customTaxRelief });
              }}
              transformValue={(v: number) => {
                return `${currency} ${Util.formatMoneyNumber(+v || 0)}`;
              }}
              error={errors.customTaxRelief}
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

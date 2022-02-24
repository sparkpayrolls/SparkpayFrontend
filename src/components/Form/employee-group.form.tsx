import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { Group } from 'src/api/types';
import { Util } from 'src/helpers/util';
import { EmployeeGroupValidation } from 'src/helpers/validation';
import { useAppSelector } from 'src/redux/hooks';
import { Button } from '../Button/Button.component';
import { InputV2, TextArea } from '../Input/Input.component';

interface IEmployeeGroupForm {
  id?: string;
  initialValues?: {
    name: string;
    description?: string;
    commonSalary?: number;
  };
  onDone?(group: Group): any;
}

export const EmployeeGroupForm = (props: IEmployeeGroupForm) => {
  const {
    initialValues = { name: '', description: '', commonSalary: '' },
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
          const data = await $api.employee.createEmployeeGroup(values);
          if (onDone) {
            onDone(data);
          }
        } catch (error) {
          const httpError = error as HttpError;
          if (httpError.status === 422) {
            helpers.setErrors(httpError.errors);
            return;
          }

          toast.error(httpError.message);
        } finally {
          helpers.setSubmitting(false);
        }
      }}
      validationSchema={EmployeeGroupValidation}
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
            <InputV2
              placeholder={`Common Salary (${currency})`}
              name="commonSalary"
              type="number"
              label="Common Salary (optional)"
              id="common_salary"
              labelFor="common_salary"
              error={touched.commonSalary && errors.commonSalary}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.commonSalary}
              transformValue={(val) => {
                const valTransformed = +`${val}`.replace(/[^0-9.]/gi, '');
                if (isNaN(valTransformed) || !val || val === '') return '';

                return `${currency} ${valTransformed.toLocaleString()}`;
              }}
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

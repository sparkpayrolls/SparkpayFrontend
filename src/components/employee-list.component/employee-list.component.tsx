import { Formik } from 'formik';
import { BulkEmployeeAddValidation } from 'src/helpers/validation';
import { IF } from '../Misc/if.component';
import { EmployeesForm } from './employee-form.component/employee-form.component';
import { useEmployeeListContext } from './hooks';

export const EmployeeList = () => {
  const {
    currency,
    employees,
    handleSubmit,
    parsed,
    payoutMethod,
    payoutMethods,
  } = useEmployeeListContext();

  return (
    <div className="employee-list">
      <Formik
        key={JSON.stringify(employees)}
        initialValues={{ employees }}
        validationSchema={BulkEmployeeAddValidation}
        onSubmit={handleSubmit}
      >
        {(props) => {
          return (
            <IF condition={parsed && payoutMethod}>
              <EmployeesForm
                formikProps={props}
                currency={currency}
                headerRow={parsed?.headerRow}
                payoutMethod={payoutMethod as typeof payoutMethods[0]}
              />
            </IF>
          );
        }}
      </Formik>
    </div>
  );
};

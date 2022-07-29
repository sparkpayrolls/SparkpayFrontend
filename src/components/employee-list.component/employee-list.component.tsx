import { Formik } from 'formik';
import { BulkEmployeeAddValidation } from 'src/helpers/validation';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import { IF } from '../Misc/if.component';
import { EmployeesForm } from './employee-form.component/employee-form.component';
import { useEmployeeListContext } from './hooks';

export const EmployeeList = () => {
  const {
    loading,
    parsed,
    employees,
    handleSubmit,
    payoutMehtodContext,
    currency,
  } = useEmployeeListContext();

  return (
    <DashboardLayoutV2
      loading={loading}
      title="Employee list"
      href="/employees"
    >
      <IF condition={parsed}>
        <Formik
          initialValues={{ employees }}
          validationSchema={BulkEmployeeAddValidation}
          onSubmit={handleSubmit}
        >
          {(props) => {
            return (
              <EmployeesForm
                formikProps={props}
                payoutMethodContext={payoutMehtodContext}
                currency={currency}
                headerRow={parsed?.headerRow}
                payoutMethod={parsed?.payoutMethod as string}
              />
            );
          }}
        </Formik>
      </IF>
    </DashboardLayoutV2>
  );
};

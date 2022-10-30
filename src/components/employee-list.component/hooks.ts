import { FormikHelpers } from 'formik';
import pick from 'lodash.pick';
import { useRouter } from 'next/router';
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { Util } from 'src/helpers/util';
import { useAppSelector } from 'src/redux/hooks';
import { Parsed, Values } from './types';

export const useEmployeeListContext = () => {
  const router = useRouter();
  const administrator = useAppSelector((state) => state.administrator);
  const country = Util.getCountryFromAdministrator(administrator);
  const currency = country?.currencySymbol as string;
  const [parsed, setParsed] = useState<Parsed>();
  const [loading, setLoading] = useState(false);
  const {
    loading: loadingPayoutMethodContext,
    context: payoutMehtodContext,
  } = usePayoutMethodContext(parsed?.payoutMethod as string);
  const { gotoPayrollCreation } = router.query;

  const getParsed = useCallback(async () => {
    try {
      setLoading(true);
      const file = router.query.file;
      if (file && typeof file === 'string') {
        const parsed = await $api.file.parseSavedEmployeeUploadXlsx(file);
        setParsed(parsed);
        return;
      }
    } catch (error) {
      toast.error('xlsx invalid or deleted, upload again');
      router.push('/employees');
      return;
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    getParsed();
  }, [getParsed]);

  const handleSubmit = async (
    values: Values,
    helpers: FormikHelpers<Values>,
  ) => {
    try {
      const valuesTransformed = {
        employees: values.employees.map((employee) => {
          return pick(employee, [
            'firstname',
            'lastname',
            'email',
            'salary',
            'phoneNumber',
            'payoutMethod',
            'payoutMethodMeta',
          ]);
        }),
      };
      helpers.setSubmitting(true);
      await $api.employee.addEmployees(valuesTransformed);
      toast.success('Employees added successfully.');
      if (gotoPayrollCreation) {
        router.replace('/payroll/create');
        return;
      }
      router.replace('/employees');
    } catch (error) {
      Util.onNonAuthError(error, (httpError) => {
        if (httpError.status === 422) {
          helpers.setErrors(httpError.errors);
          return;
        }
        toast.error(httpError.message);
      });
    }
  };

  return {
    currency,
    employees: parsed?.data || [],
    handleSubmit,
    parsed,
    loading: loading || loadingPayoutMethodContext,
    payoutMehtodContext,
  };
};

const usePayoutMethodContext = (method?: string) => {
  const [context, setContext] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const administrator = useAppSelector((state) => state.administrator);

  useEffect(() => {
    if (method === 'Bank Transfer') {
      setLoading(true);
      const country = Util.getCountryFromAdministrator(administrator);
      $api.payout
        .getSupportedBanks(country.id, { all: true })
        .then(({ data: banks }) => {
          setContext({ banks });
        })
        .finally(() => setLoading(false));
    }
  }, [administrator, method]);

  return { context, loading };
};

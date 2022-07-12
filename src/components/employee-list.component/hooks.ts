import { FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { usePayoutMethods } from 'src/helpers/hooks/use-payout-methods.hook';
import { Util } from 'src/helpers/util';
import { useAppSelector } from 'src/redux/hooks';
import { Parsed, Values } from './types';

export const useEmployeeListContext = () => {
  const router = useRouter();
  const administrator = useAppSelector((state) => state.administrator);
  const country = Util.getCountryFromAdministrator(administrator);
  const currency = country?.currencySymbol as string;
  const [parsed, setParsed] = useState<Parsed>();
  const [payoutMethods] = usePayoutMethods(country?.id);
  const [payoutMethod, setPayoutMethod] = useState<{
    name: string;
    id: string;
  }>();

  const getParsed = useCallback(async () => {
    try {
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
    }
  }, [router]);

  useEffect(() => {
    getParsed();
  }, [getParsed]);

  useEffect(() => {
    const payoutMethodRegex = new RegExp(parsed?.payoutMethod || '', 'gi');
    const payoutMethod = payoutMethods.find((p) =>
      payoutMethodRegex.test(p.name),
    );
    setPayoutMethod(payoutMethod || payoutMethods[0]);
  }, [parsed?.payoutMethod, payoutMethods]);

  const handleSubmit = async (
    values: Values,
    helpers: FormikHelpers<Values>,
  ) => {
    try {
      helpers.setSubmitting(true);
      const transValues = {
        employees: values.employees.map(({ payoutDetails: __, ...details }) => {
          return details;
        }),
      };
      await $api.employee.addEmployees(transValues as any);
      toast.success('Employees added successfully.');
      router.push('/employees');
    } catch (error) {
      Util.onNonAuthError(error, (httpError) => {
        toast.error(httpError.message);
      });
    }
  };

  const employees =
    parsed?.data?.map((row) => {
      const [
        firstname,
        lastname,
        salary,
        email,
        phoneNumber,
        ...payoutDetails
      ] = row;

      return {
        firstname,
        lastname,
        email,
        phoneNumber,
        salary,
        payoutMethod: payoutMethod?.id as string,
        payoutDetails,
      };
    }) || [];

  return {
    currency,
    employees,
    handleSubmit,
    parsed,
    payoutMethod,
    payoutMethods,
  };
};

import { FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { ICreatePayrollPayload } from 'src/api/types';
import { useAppSelector } from 'src/redux/hooks';
import { Util } from '../util';
import { usePayrollProcessingParam } from './use-payroll-processing-param.hook';
import { usePayrollSummary } from './use-payroll-summary.hook';
import { useWalletBalance } from './use-wallet-balance.hook';

export const usePayrollSummaryPageLogic = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const router = useRouter();
  const formRef = useRef<HTMLInputElement>(null);
  const { walletBalance, loading: loadingWalletBalance } = useWalletBalance();
  const { params, setParams } = usePayrollProcessingParam();
  const { summary, loading: loadingSummary } = usePayrollSummary(params);

  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const signedParams = Util.signPayload(params);
  const createUrl = `/payroll/create?params=${signedParams}`;

  const getCreatePayrollFormHandler = () => {
    return async (
      values: ICreatePayrollPayload,
      helpers: FormikHelpers<ICreatePayrollPayload>,
    ) => {
      try {
        helpers.setSubmitting(true);
        const payroll = await $api.payroll.createPayroll(values);
        toast.success('payroll created');
        router.push(`/payroll/${payroll.id}`);
      } catch (error) {
        Util.onNonAuthError(error, (err) => {
          if (err.status === 422) {
            helpers.setErrors(err.errors);
            return;
          }
          toast.error(err.message);
          helpers.setSubmitting(false);
        });
      }
    };
  };

  const getSaveClickHandler = () => {
    return () => {
      const submit = formRef.current;
      if (submit) {
        submit.click();
      }
    };
  };

  return {
    walletBalance,
    loadingWalletBalance,
    currency,
    createUrl,
    summary,
    loadingSummary,
    formRef,
    params,
    setParams,
    getCreatePayrollFormHandler,
    getSaveClickHandler,
  };
};

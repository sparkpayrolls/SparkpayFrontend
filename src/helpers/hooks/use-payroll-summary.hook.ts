import { useState, useCallback, useEffect } from 'react';
import { $api } from 'src/api';
import { PayrollSummary } from 'src/api/types';
import { useAppSelector } from 'src/redux/hooks';
import { IProcessPayrollParam } from './use-payroll-processing-param.hook';

export const usePayrollSummary = (
  params: IProcessPayrollParam,
  paramsReady: boolean,
) => {
  const administrator = useAppSelector((state) => state.administrator);
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const getSummary = useCallback(async () => {
    if (!paramsReady) {
      return;
    }
    try {
      setLoading(true);
      const summary = await $api.payroll.getSummary(params);

      setSummary(summary);
    } catch (error) {
      // ...
    } finally {
      setLoading(false);
    }
  }, [params, paramsReady]);

  useEffect(() => {
    getSummary();
  }, [getSummary, administrator]);

  return { summary, loading };
};

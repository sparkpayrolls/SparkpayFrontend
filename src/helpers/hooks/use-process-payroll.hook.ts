import { useState, useCallback, useEffect } from 'react';
import { $api } from 'src/api';
import { ProcessPayrollResponse } from 'src/api/types';
import { useAppSelector } from 'src/redux/hooks';
import { Util } from '../util';
import { IProcessPayrollParam } from './use-payroll-processing-param.hook';

type IuseProcessPayrollConfig = {
  ignoreExcludedEmployee?: boolean;
};

export const useProcessPayroll = (
  params: IProcessPayrollParam,
  config: IuseProcessPayrollConfig = {},
) => {
  const { ignoreExcludedEmployee = false } = config;
  const administrator = useAppSelector((state) => state.administrator);
  const [payroll, setPayroll] = useState<ProcessPayrollResponse>();
  const [loading, setLoading] = useState(true);
  const [param, setParam] = useState(params);

  const getPayroll = useCallback(async () => {
    try {
      setLoading(true);
      const payroll = await $api.payroll.processPayroll(param);

      setPayroll(payroll);
    } catch (error) {
      // ...
    } finally {
      setLoading(false);
    }
  }, [param]);

  useEffect(() => {
    getPayroll();
  }, [getPayroll, administrator]);

  useEffect(() => {
    let _param = { ...param };
    let _params = { ...params };
    if (ignoreExcludedEmployee) {
      delete _param.excludedEmployeeIds;
      delete _params.excludedEmployeeIds;
    }
    const paramsChanged =
      !Util.deepEquals(_param, _params) || !Util.deepEquals(_params, _param);
    if (paramsChanged) {
      setParam(_params);
    }
  }, [ignoreExcludedEmployee, param, params]);

  return { payroll, loading, getPayroll };
};

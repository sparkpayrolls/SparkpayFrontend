import moment from 'antd/node_modules/moment';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Addon } from 'src/api/types';
import { Util } from '../util';

export type IProcessPayrollParam = {
  proRateMonth: string;
  excludedEmployeeIds?: string[];
  cycle?: number;
  year?: number;
  addons?: Addon[];
};

const defaultParams = {
  proRateMonth: moment().format('MMMM'),
  excludedEmployeeIds: [],
  cycle: 1,
  year: +moment().format('YYYY'),
};

export const usePayrollProcessingParam = () => {
  const router = useRouter();
  const [params, setParams] = useState<IProcessPayrollParam>(defaultParams);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      const queryParams = router.query.params as string;
      const decoded =
        Util.decodePayload<typeof defaultParams>(queryParams) || defaultParams;

      setParams(decoded);
      setIsReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  useEffect(() => {
    router.replace(`${router.pathname}?params=${Util.signPayload(params)}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const _setParams = (_params: Partial<IProcessPayrollParam>) => {
    setParams({ ...params, ..._params });
  };

  return { params, setParams: _setParams, isReady };
};

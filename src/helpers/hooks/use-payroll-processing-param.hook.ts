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

export const usePayrollProcessingParam = () => {
  const router = useRouter();
  const thisMoment = moment();
  const [params, setParams] = useState<IProcessPayrollParam>({
    proRateMonth: thisMoment.format('MMMM'),
    excludedEmployeeIds: [],
    cycle: 1,
    year: +thisMoment.format('YYYY'),
  });

  useEffect(() => {
    if (router.isReady) {
      const queryParams = router.query.params as string;
      const decoded =
        Util.decodePayload<Record<string, unknown>>(queryParams) || {};
      const update = { ...params, ...decoded };
      if (
        !Util.deepEquals(update, params) ||
        !Util.deepEquals(params, update)
      ) {
        setParams(update);
      }
    }
  }, [router, params]);

  const _setParams = (_params: Partial<IProcessPayrollParam>) => {
    const newParams = { ...params, ..._params };
    router.replace(`${router.pathname}?params=${Util.signPayload(newParams)}`);
  };

  return { params, setParams: _setParams };
};

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { Audit, PaginateParams, Response } from 'src/api/types';
import { useAppSelector } from 'src/redux/hooks';
import { Util } from '../util';

export const useAuditLogs = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const [auditLogs, setAuditLogs] = useState<Response<Audit[]>>();
  const [params, setParams] = useState<PaginateParams>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    $api.audit
      .getLogs(params)
      .then(setAuditLogs)
      .catch((error) => {
        Util.onNonAuthError(error, (httpError) => {
          toast.error(httpError.message);
        });
      })
      .finally(() => setLoading(false));
  }, [administrator, params]);

  return { auditLogs, loading, setParams };
};

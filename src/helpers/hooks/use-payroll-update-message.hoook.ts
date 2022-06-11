import { useEffect, useState } from 'react';
import { $api } from 'src/api';
import { useSocket } from './use-socket.hook';

type IusePayrollUpdateMessage = {
  message: string;
  actions?: string[];
};

export const usePayrollUpdateMessage = () => {
  const socket = useSocket();
  const [update, setUpdate] = useState<IusePayrollUpdateMessage>({
    message: '',
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    $api.payroll
      .getPayrollUpdate()
      .then(setUpdate)
      .catch(() => {
        /** */
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('PayrollUpdateMessage', setUpdate);
    }
  }, [socket]);

  return { update, loading };
};

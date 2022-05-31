import { useCallback, useEffect, useState } from 'react';
import { $api } from 'src/api';
import { PayoutMethod } from 'src/api/types';

export const usePayoutMethods = (
  country?: string,
): [PayoutMethod[], boolean] => {
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const getPayoutMethods = useCallback(async () => {
    try {
      setPayoutMethods([]);
      setLoading(true);
      if (country) {
        const payoutMethods = await $api.payout.getSupportedPayoutMethods(
          country,
        );
        setPayoutMethods(payoutMethods);
      }
    } catch (error) {
      // ....
    } finally {
      setLoading(false);
    }
  }, [country]);

  useEffect(() => {
    getPayoutMethods();
  }, [getPayoutMethods]);

  return [payoutMethods, loading];
};

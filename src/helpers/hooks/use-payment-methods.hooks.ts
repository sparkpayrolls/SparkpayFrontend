import { useCallback, useEffect, useState } from 'react';
import { $api } from 'src/api';
import { Company, Country, PaymentMethod } from 'src/api/types';
import { useAppSelector } from 'src/redux/hooks';

export const usePaymentMethods = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const getPaymentMethods = useCallback(async () => {
    try {
      setLoading(true);
      const company = administrator?.company as Company;
      const country = company?.country as Country;
      const paymentMethods = await $api.payment.getPaymentMethods(country.id);

      setPaymentMethods(paymentMethods);
    } catch (error) {
      // ...
    } finally {
      setLoading(false);
    }
  }, [administrator]);

  useEffect(() => {
    getPaymentMethods();
  }, [getPaymentMethods]);

  return { loading, paymentMethods };
};

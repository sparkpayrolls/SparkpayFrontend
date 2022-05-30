import { useCallback, useEffect, useState } from 'react';
import { $api } from 'src/api';
import { useAppSelector } from 'src/redux/hooks';

export const useWalletBalance = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const getCompanyWallet = useCallback(async () => {
    try {
      setLoading(true);
      const wallet = await $api.payroll.getCompanyWallet();

      setWalletBalance(wallet.balance);
    } catch (error) {
      // ...
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCompanyWallet();
  }, [getCompanyWallet, administrator]);

  return { loading, walletBalance };
};

import { useCallback, useEffect, useState } from 'react';
import { $api } from 'src/api';
import { CompanyWallet } from 'src/api/types';
import { useAppSelector } from 'src/redux/hooks';
import { useSocket } from './use-socket.hook';

export const useWalletBalance = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

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

  useEffect(() => {
    if (socket) {
      socket.on('CompanyWallet', (data: CompanyWallet) => {
        setWalletBalance(data.balance);
      });
    }
  }, [socket]);

  return { loading, walletBalance };
};

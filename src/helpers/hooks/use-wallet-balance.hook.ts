import { useCallback, useEffect, useState } from 'react';
import { $api } from 'src/api';
import { CompanyWallet } from 'src/api/types';
import { useAppSelector } from 'src/redux/hooks';
import { useSocket } from './use-socket.hook';

export const useWallet = (companyWallet?: CompanyWallet) => {
  const administrator = useAppSelector((state) => state.administrator);
  const [wallet, setWallet] = useState(companyWallet);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const getCompanyWallet = useCallback(async () => {
    try {
      setLoading(true);
      const wallet = await $api.payroll.getCompanyWallet();

      setWallet(wallet);
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
        setWallet(data);
      });
    }
  }, [socket]);

  return { loading, wallet, reloadWallet: getCompanyWallet };
};

export const useWalletBalance = () => {
  const { loading, wallet } = useWallet();

  return { loading, walletBalance: wallet?.balance || 0 };
};

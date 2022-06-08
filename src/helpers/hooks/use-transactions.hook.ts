import { useState, useCallback, useEffect } from 'react';
import { $api } from 'src/api';
import { PaginateParams, Response, WalletTransaction } from 'src/api/types';
import { useAppSelector } from 'src/redux/hooks';
import { useSocket } from './use-socket.hook';

export const useTransactions = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState<PaginateParams>({});
  const [transactions, setTransactions] = useState<
    Response<WalletTransaction[]>
  >();
  const socket = useSocket();

  const getTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await $api.companyWallet.getCompanyWalletTransactions(
        params,
      );
      setTransactions(response);
    } catch (error) {
      //....
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    getTransactions();
  }, [getTransactions, administrator]);

  useEffect(() => {
    if (socket) {
      socket.on('WalletTransaction', () => {
        socket.emit(
          'GetWalletTransactions',
          params,
          (transactions: Response<WalletTransaction[]>) => {
            setTransactions(transactions);
          },
        );
      });
    }
  }, [socket, params]);

  return { loading, setParams, transactions };
};

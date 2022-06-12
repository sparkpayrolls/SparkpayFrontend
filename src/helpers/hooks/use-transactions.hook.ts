import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { PaginateParams, Response, WalletTransaction } from 'src/api/types';
import { useAppSelector } from 'src/redux/hooks';
import { Util } from '../util';
import { useSocket } from './use-socket.hook';

export const useTransactions = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const [loading, setLoading] = useState(true);
  const [loadingExport, setLoadingExport] = useState(false);
  const [params, setParams] = useState<PaginateParams>({});
  const [transactions, setTransactions] = useState<
    Response<WalletTransaction[]>
  >();
  const socket = useSocket();

  const exportTransactions = () => {
    if (loadingExport) return;
    setLoadingExport(true);
    $api.companyWallet
      .exportTransactions(params)
      .then(({ file, name }) => {
        const link = document.createElement('a');

        link.href = file;
        link.download = name;
        link.click();
      })
      .catch((error) => {
        Util.onNonAuthError(error, () => {
          toast.error('error exporting transactions');
        });
      })
      .finally(() => setLoadingExport(false));
  };

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

  return {
    loading,
    params,
    setParams,
    transactions,
    loadingExport,
    exportTransactions,
  };
};

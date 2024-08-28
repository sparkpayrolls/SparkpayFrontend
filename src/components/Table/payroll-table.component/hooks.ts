import { IKebabItem } from '@/components/KebabMenu/KebabMenu.component';
import { confirmation } from '@/components/Modals/ConfirmationModal.component';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { Payroll, Response } from 'src/api/types';
import { useSocket } from 'src/helpers/hooks/use-socket.hook';
import { Util } from 'src/helpers/util';
import { useAppSelector } from 'src/redux/hooks';

export const usePayrollTableContext = () => {
  const [params, setParams] = useState<Record<string, unknown>>({});
  const [payroll, setPayroll] = useState<Response<Payroll[]>>();
  const [loading, setLoading] = useState(true);
  const administrator = useAppSelector((state) => state.administrator);
  const socket = useSocket();
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const headerRow = [
    'Prorate\xa0Month',
    `Amount\xa0(${currency})`,
    'Payroll\xa0size',
    'Status',
    'Payout\xa0Date',
  ];

  const getPayrolls = useCallback(async () => {
    try {
      setLoading(true);
      const payroll = await $api.payroll.getPayrolls(params);
      setPayroll(payroll);
    } catch (error) {
      //...
    } finally {
      setLoading(false);
    }
  }, [params]);
  const refresh = (
    page?: number | undefined,
    perPage?: number | undefined,
    search?: string | undefined,
    all?: boolean | undefined,
  ) => {
    setParams({ page, perPage, search, all });
  };
  const downloadReport = async (id: string) => {
    try {
      setLoading(true);
      const report = await $api.payroll.downloadReport([id]);

      Util.downloadFile({
        file: `data:application/pdf;base64,${report}`,
        name: 'payslip.pdf',
      });

      toast.success('payroll report downloaded successfully');
    } catch (error) {
      Util.onNonAuthError(error, (err) => {
        toast.error(err.message);
      });
    } finally {
      setLoading(false);
    }
  };
  const pausePayroll = async (id: string) => {
    try {
      setLoading(true);
      await $api.payroll.pausePendingPayroll(id);
      toast.success('payroll paused successfully');
      getPayrolls();
    } catch (error) {
      Util.onNonAuthError(error, (err) => {
        toast.error(err.message);
      });
    } finally {
      setLoading(false);
    }
  };
  const resumePayroll = async (id: string) => {
    try {
      setLoading(true);
      await $api.payroll.resumePausedPayroll(id);
      toast.success('payroll resumed successfully');
      getPayrolls();
    } catch (error) {
      Util.onNonAuthError(error, (err) => {
        toast.error(err.message);
      });
    } finally {
      setLoading(false);
    }
  };
  const deletePayroll = async (id: string) => {
    if (!loading) {
      const shouldDelete = await confirmation({
        title: 'Delete Payroll',
        text: 'Are you sure you want to permanently delete this payroll?',
      });
      if (shouldDelete) {
        try {
          setLoading(true);
          await $api.payroll.deletePayroll(id);
          toast.success('payroll deleted successfully');
          getPayrolls();
        } catch (error) {
          Util.onNonAuthError(error, (err) => {
            toast.error(err.message);
          });
        } finally {
          setLoading(false);
        }
      }
    }
  };
  const getMenuItems = (payroll: Payroll) => {
    const canActivate = Util.canActivate([['Payroll', 'write']], administrator);
    const items: IKebabItem[] = [
      { href: `/payroll/${payroll.id}`, value: 'View' },
      {
        action() {
          downloadReport(payroll.id);
        },
        value: 'Download Report',
      },
    ];
    if (canActivate) {
      if (payroll.status === 'pending') {
        items.push({
          action() {
            pausePayroll(payroll.id);
          },
          value: 'Pause',
        });
      }

      if (payroll.status === 'paused') {
        items.push({
          action() {
            resumePayroll(payroll.id);
          },
          value: 'Resume',
        });
      }

      if (['paused', 'pending'].includes(payroll.status as any)) {
        items.push({
          action() {
            deletePayroll(payroll.id);
          },
          value: 'Delete',
        });
      }
    }

    return items;
  };

  useEffect(() => {
    getPayrolls();
  }, [getPayrolls, administrator]);

  useEffect(() => {
    if (socket) {
      socket.on('Payroll', () => {
        socket.emit('GetPayrolls', params, (data: Response<Payroll[]>) => {
          setPayroll(data);
        });
      });
    }
  }, [params, socket]);

  return {
    currency,
    headerRow,
    loading,
    params,
    payroll,
    getMenuItems,
    refresh,
  };
};

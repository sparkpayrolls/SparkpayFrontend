import withAuth from 'src/helpers/HOC/withAuth';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import { Table } from 'src/components/Table/Table.component';
import { DateTimeChip } from '@/components/DateTimeChip/date-time-chip';
import { KebabMenu } from '@/components/KebabMenu/KebabMenu.component';
import { RemittancePaymentReceiptsModal } from '@/components/Modals/RemittancePaymentReceiptsModal.component';
import NiceModal from '@ebay/nice-modal-react';
import { Select } from '@/components/Input/select.component';
import { StatusChip } from '@/components/StatusChip/status-chip.component';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { $api } from 'src/api';
import { PaginationMeta } from 'src/api/types';
import { toast } from 'react-toastify';
import { HttpError } from 'src/api/repo/http.error';
import { ITable } from '@/components/types';

type Payment = {
  receipts: string[];
  id: string;
  amount: string;
  period: string;
  status: string;
  dateCreated: string;
};

type RemittanceType = 'tax' | 'pension' | 'nhf';

type RemittancePaymentTableChildrenProps = {
  payments: Payment[];
};

const getPaymentMenu = (payment: Payment) => {
  if (!payment.receipts.length) return [];

  return [
    {
      action: () => {
        NiceModal.show(RemittancePaymentReceiptsModal, {
          receipts: payment.receipts,
        });
      },
      value: 'View Receipts',
    },
  ];
};

const RemittancePaymentTableChildren = (
  props: RemittancePaymentTableChildrenProps,
) => {
  const { payments } = props;

  return (
    <tbody>
      {payments.map((payment) => {
        return (
          <tr key={payment.id}>
            <td>{payment.id}</td>
            <td>{payment.amount}</td>
            <td>{payment.period}</td>
            <td>
              <StatusChip status={payment.status as 'completed'} />
            </td>
            <td>
              <span className="flex justify-between items-center">
                <DateTimeChip date={payment.dateCreated} />

                <KebabMenu items={getPaymentMenu(payment)} />
              </span>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

type RemittancePaymentTableProps = RemittancePaymentTableChildrenProps & {
  headerRow: string[];
  title: string;
  meta?: PaginationMeta;
  refresh?: ITable['refresh'];
  loading?: boolean;
};

const RemittancePaymentsTable = (props: RemittancePaymentTableProps) => {
  const { headerRow, title, payments, meta, refresh } = props;

  return (
    <div>
      <Table
        headerRow={headerRow}
        title={title}
        emptyStateText="No remittance payments yet"
        isNotSelectable
        isNotSearchable
        paginationMeta={meta}
        refresh={refresh}
        isEmpty={!payments?.length}
        isLoading={props.loading}
      >
        {() => <RemittancePaymentTableChildren payments={payments} />}
      </Table>
    </div>
  );
};

const RemittancePayments = () => {
  const router = useRouter();
  const [
    selectedRemittanceType,
    setSelectedRemittanceType,
  ] = useState<RemittanceType>('tax');

  const headerRow = ['ID', 'Amount', `Periods`, 'Status', 'Date\xa0Created'];
  const remittanceTypeOptions = [
    { label: 'Tax', value: 'tax' },
    { label: 'Pension', value: 'pension' },
    { label: 'NHF', value: 'nhf' },
  ];
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('Remittance Payments');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getPayments = useCallback(
    debounce(
      async (
        remittanceType: string,
        page?: number,
        limit?: number,
        search?: string,
        all?: boolean,
      ) => {
        setTitle('Remittance Payments');
        setLoading(true);

        $api.remittance
          .getRemittancePayments({
            type: remittanceType,
            page,
            limit,
            search,
            all,
          })
          .then(({ data, meta }) => {
            const _payments = data.map((payment) => ({
              id: payment.id,
              amount: payment.totalAmount.toLocaleString('en-US', {
                style: 'currency',
                currency: 'NGN',
              }),
              period: payment.payrolls
                .map((p) => `${p.year}/${p.proRateMonth}`)
                .join(', '),
              receipts: payment.receipts,
              status: payment.status,
              dateCreated: payment.createdAt,
            }));

            setPayments(_payments);
            setMeta(meta);
            setTitle(`${meta?.total || 0} Remittance Payments`);
          })
          .catch((error: HttpError) => {
            toast.error(
              `Error fetching remittance payments - ${error.message}`,
            );
          })
          .finally(() => setLoading(false));
      },
      500,
    ),
    [],
  );

  const refresh = (
    page?: number,
    limit?: number,
    search?: string,
    all?: boolean,
  ) => {
    getPayments(selectedRemittanceType, page, limit, search, all);
  };

  // Initialize remittance type from URL query parameter
  useEffect(() => {
    const { type } = router.query;
    if (type && ['tax', 'pension', 'nhf'].includes(type as string)) {
      setSelectedRemittanceType(type as RemittanceType);
    } else if (router.isReady && !type) {
      // Redirect to default type if none specified
      router.push(
        {
          pathname: router.pathname,
          query: { type: 'tax' },
        },
        undefined,
        { shallow: true },
      );
    }
  }, [router]);

  useEffect(() => {
    getPayments(selectedRemittanceType);
  }, [getPayments, selectedRemittanceType]);

  // Update URL when remittance type changes
  const handleRemittanceTypeChange = (value: string) => {
    const newType = value as RemittanceType;
    setSelectedRemittanceType(newType);

    // Update URL without page refresh
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, type: newType },
      },
      undefined,
      { shallow: true },
    );
  };

  // Get display title based on selected type
  const getDisplayTitle = () => {
    const typeLabels = {
      tax: 'Tax',
      pension: 'Pension',
      nhf: 'NHF',
    };
    return `${typeLabels[selectedRemittanceType]} Remittance Payments`;
  };

  return (
    <DashboardLayout pageTitle={getDisplayTitle()}>
      <div className="payroll-section">
        <div className=" payroll-section__details">
          <div className="payroll-section__head">
            <div className="flex items-center gap-4">
              <h1 className="payroll-section__title">{getDisplayTitle()}</h1>
            </div>

            <div className="payroll-section__employee-button">
              <Select
                label="Select Remittance Type"
                className="min-w-[200px]"
                placeholder="Select Remittance Type"
                options={remittanceTypeOptions}
                value={selectedRemittanceType}
                onChange={handleRemittanceTypeChange}
              />
            </div>
          </div>

          <RemittancePaymentsTable
            headerRow={headerRow}
            title={title}
            payments={payments}
            meta={meta}
            refresh={refresh}
            loading={loading}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(RemittancePayments, ['Company', 'read']);

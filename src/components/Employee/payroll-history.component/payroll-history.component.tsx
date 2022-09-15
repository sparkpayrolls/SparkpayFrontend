import { DateTimeChip } from '@/components/DateTimeChip/date-time-chip';
import { KebabMenu } from '@/components/KebabMenu/KebabMenu.component';
import { StatusChip } from '@/components/StatusChip/status-chip.component';
import { Table } from '@/components/Table/Table.component';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import {
  EmployeePayrollHistory as EmployeePayrollHistoryType,
  PaginationMeta,
} from 'src/api/types';
import { useSelectItems } from 'src/helpers/hooks/use-select-items.hook';
import { Util } from 'src/helpers/util';

const actionButtonStyle = {
  padding: '.5rem 1.5rem',
  borderRadius: '8px',
  backgroundColor: '#EDF1FD',
  color: '#1D4ED8',
  lineHeight: '1.5rem',
  fontSize: '1rem',
  fontWeight: 700,
  letterSpacing: '-1%',
  border: 'none',
  cursor: 'pointer',
};

export const EmployeePayrollHistory = () => {
  const router = useRouter();
  const [payrolls, setPayrolls] = useState<EmployeePayrollHistoryType[]>([]);
  const {
    allChecked,
    selected,
    selectAll,
    handleCheckAllClick,
    getCheckClickHandler,
    handleSelectAllClick,
    clearSelection,
  } = useSelectItems(payrolls.map((payroll) => payroll.id));
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    total: 0,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    page: 1,
    pageCount: 1,
    pagingCounter: 1,
    perPage: 10,
    previousPage: null,
  });
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: '',
  });
  const [loading, setLoading] = useState(false);
  const employeeId = router.query.id as string;

  const getPayrolls = useCallback(() => {
    setLoading(true);
    return $api.employee
      .getEmployeePayrollHistory(employeeId, params)
      .then(({ data, meta = {} }) => {
        setPayrolls(data);
        setPaginationMeta((p) => ({ ...p, ...meta }));
      })
      .catch((error) => {
        Util.onNonAuthError(error, (error) => {
          toast.error(`error fetching employee payroll - ${error.message}`);
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [employeeId, params]);

  useEffect(() => {
    getPayrolls();
  }, [getPayrolls]);

  const updateParams = (obj: Record<string, unknown>) => {
    setParams({ ...params, ...obj });
  };

  const getPayslips = (params: {
    payrolls: string[];
    shouldDownloadOnly?: boolean;
    all?: boolean;
  }) => {
    return () => {
      if (!params.payrolls.length || loading) {
        return;
      }

      setLoading(true);
      $api.employee
        .getEmployeePayslips(employeeId, params)
        .then((payslips) => {
          let verb = 'sent';
          if (params.shouldDownloadOnly) {
            verb = 'retrieved';
            payslips.forEach((payslip) =>
              Util.downloadFile({
                file: `data:application/pdf;base64,${payslip}`,
                name: 'payslip.pdf',
              }),
            );
          }
          toast.success(`payslips ${verb} successfully.`);
        })
        .catch((error) => {
          Util.onNonAuthError(error, (error) => {
            toast.error(`error fetching employee payslips - ${error.message}`);
          });
        })
        .finally(() => {
          setLoading(false);
          clearSelection();
        });
    };
  };

  return (
    <Table
      headerRow={[
        <div key="prorate_month_th_content" className="d-flex gap-2">
          <input
            checked={allChecked}
            onChange={handleCheckAllClick}
            type="checkbox"
          />
          <span>Prorate Month</span>
        </div>,
        'Salary',
        'Net Salary',
        'Status',
        'Pay Date',
      ]}
      title={`${Util.formatMoneyNumber(paginationMeta.total)} Payrolls`}
      appendToolBar={
        <div className="d-flex gap-1 align-items-center">
          <button
            onClick={getPayslips({
              shouldDownloadOnly: true,
              all: selectAll,
              payrolls: selected,
            })}
            style={actionButtonStyle}
          >
            Download Payslips
          </button>

          <button
            onClick={getPayslips({
              all: selectAll,
              payrolls: selected,
            })}
            style={actionButtonStyle}
          >
            Send Payslips
          </button>
        </div>
      }
      paginationMeta={paginationMeta}
      isEmpty={payrolls.length < 1}
      emptyStateText="Employee payroll history will show up here"
      selectAllNoun="payrolls"
      allChecked={allChecked}
      shouldClearSelection={selectAll}
      isLoading={loading}
      onSelectAll={handleSelectAllClick}
      onClearSelection={clearSelection}
      refreshV2={updateParams}
      isNotSelectable
      isNotSearchable
    >
      {() => {
        return (
          <tbody>
            {payrolls.map((payroll) => {
              return (
                <tr key={payroll.id}>
                  <td>
                    <div className="d-flex gap-2 align-items-center">
                      <input
                        checked={selected.includes(payroll.id)}
                        onChange={getCheckClickHandler(payroll.id)}
                        type="checkbox"
                      />

                      <span>{payroll.payroll?.proRateMonth}</span>
                    </div>
                  </td>

                  <td>{Util.formatMoneyNumber(payroll.salary, 2)}</td>

                  <td>{Util.formatMoneyNumber(payroll.netSalary, 2)}</td>

                  <td>
                    <StatusChip status={payroll.payoutStatus} />
                  </td>

                  <td>
                    <div className="d-flex align-items-center">
                      <DateTimeChip date={payroll.payroll?.payDate} />

                      <div className="ml-auto">
                        <KebabMenu
                          items={[
                            {
                              action: getPayslips({
                                shouldDownloadOnly: true,
                                payrolls: [payroll.payroll.id],
                              }),
                              value: 'Download Payslip',
                            },
                            {
                              action: getPayslips({
                                payrolls: [payroll.payroll.id],
                              }),
                              value: 'Send Payslip',
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        );
      }}
    </Table>
  );
};

import React from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import { Button } from '../../src/components/Button/Button.component';
import Billing from '../../public/svgs/Billing.svg';
import PurpleImage from '../../public/svgs/purplewallet.svg';
import YellowImage from '../../public/svgs/yellowsvg.svg';
import { useCallback, useState, useEffect } from 'react';
import { Table, TR } from '../../src/components/Table/Wallet.component';
import { PaginationMeta } from 'src/api/types';
import Wallet from '../../public/svgs/wallet bill.svg';
const WalletCard = ({ title, amount }: { title: string; amount: string }) => {
  return (
    <div>
      <div className="wallet-billing-page__wallet-amount">
        <div className="wallet-billing-page__wallet-purple-image">
          <Image src={PurpleImage} alt="purple image" />
        </div>
        <div className="wallet-billing-page__wallet-text">
          <p>{title}</p>
          <p className="wallet-billing-page__wallet-amount-text">{amount}</p>
        </div>
        <div>
          <Button
            label={<>{'Fund Wallet'}</>}
            onClick={() => {}}
            className="employee-section__submit-btn"
            primary
            type="submit"
          />
        </div>
      </div>
      <div className="wallet-billing-page__wallet-yellow-image">
        <Image src={YellowImage} alt="yellowImage" />
      </div>
    </div>
  );
};
const PayrollCard = ({ payrollDate }: { payrollDate: string }) => {
  return (
    <div className="wallet-billing-page__payroll-update">
      <Image src={Billing} alt="billing" />
      <div className="wallet-billing-page__payroll-update-text">
        <p>update</p>
        <p className="wallet-billing-page__payroll-date-text">{payrollDate}</p>
      </div>
    </div>
  );
};

const Transactionnames = [
  { name: 'AA304059P' },
  { name: 'AA304059P' },
  { name: 'AA304059P' },
  { name: 'AA304059P' },
  { name: 'AA304059P' },
];
const emps = new Array(200).fill(null).map(() => {
  const Transactionname =
    Transactionnames[Math.floor(Transactionnames.length * Math.random())];

  return {
    id: String(Math.random() * 1000000),
    name: `${Transactionname.name}`,
    amount: '₦ 41,200',
    TransactionMethod: 'Wallet',
    balance: '₦ 41,200',
    status: 'Successful',
    date: new Date().toISOString(),
  };
});
const getEmployees = (page = 1, perPage = 10, search = '') => {
  let empClone = emps;
  if (search) {
    empClone = empClone.filter((emp) => {
      return new RegExp(search, 'gi').test(emp.name);
    });
  }

  const pageCount = Math.ceil((empClone.length || 1) / perPage);
  const hasPrevPage = page > 1 && empClone.length >= 1;
  const hasNextPage = page < pageCount;

  return {
    data: empClone.slice((page - 1) * perPage, perPage * page),
    meta: {
      total: empClone.length,
      perPage,
      pageCount,
      page,
      pagingCounter: 1,
      hasNextPage,
      hasPrevPage,
      previousPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
    },
  };
};
const WalletBilling: NextPage = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [employees, setEmployees] = useState<typeof emps>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    total: 0,
    perPage: 10,
    pageCount: 0,
    page: 1,
    pagingCounter: 1,
    hasNextPage: false,
    hasPrevPage: false,
    previousPage: null,
    nextPage: null,
  });

  const refreshEmployees = useCallback(
    (page = 1, perPage = 7, search = '') => {
      const res = getEmployees(page, perPage, search);
      setEmployees(res.data);
      setPaginationMeta(res.meta);
    },
    [setEmployees],
  );

  useEffect(() => {
    refreshEmployees();
  }, [refreshEmployees]);

  return (
    <DashboardLayout pageTitle="WalletBilling">
      <div className="wallet-billing-page">
        <h1 className="wallet-billing-page__wallet-header-title">
          Wallet & Billings
        </h1>
        <div
          className="wallet-billing-page__wallet-cards
    "
        >
          <WalletCard title="Wallet Balance" amount="₦25,000,000.00" />
          <PayrollCard payrollDate="Next payroll date is on the 27, may" />
        </div>
        <h1 className="wallet-billing-page__transaction-text">Transactions</h1>
        <div className="organisation__table-section">
          <Table
            headerRow={[
              'Transaction ID',
              'Amount',
              'Transaction Method',
              'Balance',
              'Status',
              'Date Added',
            ]}
            allChecked={
              !!selected.length &&
              employees.every((employee) => selected.includes(employee.id))
            }
            onCheckAllClick={() => {
              if (selected.length === employees.length) {
                setSelected([]);
                return;
              }
              setSelected(employees.map((employee) => employee.id));
            }}
            paginationMeta={paginationMeta}
            refresh={refreshEmployees}
          >
            {() => {
              return (
                <tbody>
                  {employees.map((employee) => {
                    return (
                      <TR
                        key={employee.id}
                        checked={selected.includes(employee.id)}
                        onChange={() => {
                          if (selected.includes(employee.id)) {
                            setSelected(
                              selected.filter((sel) => sel !== employee.id),
                            );
                            return;
                          }

                          setSelected([...selected, employee.id]);
                        }}
                      >
                        <td>{employee.name}</td>
                        <td>{employee.amount}</td>

                        <td>
                          <span className="wallet-billing-page__wallet-image">
                            <Image src={Wallet} alt="wallet" />
                          </span>
                          {employee.TransactionMethod}
                        </td>
                        <td>{employee.balance}</td>
                        <td className="wallet-billing-page__status-text">
                          <span>
                            <SuccessSvg />
                          </span>
                          {employee.status}
                        </td>
                        <td>{employee.date}</td>
                      </TR>
                    );
                  })}
                </tbody>
              );
            }}
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WalletBilling;

const SuccessSvg = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="6" cy="6" r="6" fill="#EAFBF1" />
    <circle cx="6" cy="6" r="3" fill="#27BE63" />
  </svg>
);

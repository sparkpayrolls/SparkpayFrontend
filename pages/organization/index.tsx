import Head from 'next/head';
import Image from 'next/image';
import type { NextPage } from 'next';
import NiceModal from '@ebay/nice-modal-react';
import { useCallback, useState, useEffect } from 'react';
import { Button } from '../../src/components/Button/Button.component';
import DashboardLayout from '../../src/layouts/dashboard-layout/DashBoardLayout';
import { Table, TR } from '../../src/components/Table/organization-table';
import { toast } from 'react-toastify';
import { AddEmployeeModal } from '@/components/Modals/AddEmployeeModal.component';
import Plus from '../../public/svgs/add-fill.svg';
import credpal from '../../public/svgs/credpal.svg';
import {PaginationMeta } from 'src/api/types';



const orgnames = [
  { name: 'Credpal' },
  { name: 'Buycoins' },
  { name: 'Fluidcoin' },
  { name: 'Circa' },
  { name: 'Kellogs' },
];
const emps = new Array(200).fill(null).map(() => {
  const orgname = orgnames[Math.floor(orgnames.length * Math.random())];

  return {
    id: String(Math.random() * 1000000),
    name: `${orgname.name}`,
    email: `${orgname.name.toLowerCase()}@sparkpayhq.com`,
    amount: '08098765432',
    country: 'Nigeria',
    rcnumber: 'AE-329 00 232',
    status: 'Active',
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

const OrganizationSettings: NextPage = () => {
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
    <>
      <DashboardLayout pageTitle="Employees">
        <div className="organisation">
          <Head>
            <title></title>
          </Head>
          <div className="employee-section__head">
            <h1 className="employee-section__title">Organisation Settings</h1>

            <div className="employee-section__employee-button">
              <Button
                label={
                  <>
                    <Image src={Plus} alt="plus icon" /> {'Create Organisation'}
                  </>
                }
                onClick={() => NiceModal.show(AddEmployeeModal)}
                className="employee-section__submit-btn"
                primary
                type="submit"
              />
            </div>
          </div>
          <div className="organisation__table-section">
            <Table
              headerRow={[
                'Organisation Name',
                'Email Address',
                'Phone Number (₦)',
                'Country',
                'RC Number',
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
              title={'4 Organisations'}
              onFilterClick={() =>
                toast.success('closest thing to a filter modal')
              }
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
                          <td>
                            <span className="organisation__org-logo">
                              <Image src={credpal} />
                            </span>
                            {employee.name}
                          </td>
                          <td>{employee.email}</td>
                          <td>{employee.amount}</td>
                          <td>{employee.country}</td>
                          <td>{employee.rcnumber}</td>
                          <td>
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
    </>
  );
};

export default OrganizationSettings;

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

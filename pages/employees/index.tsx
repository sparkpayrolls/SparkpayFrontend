import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import type { NextPage } from 'next';
import NiceModal from '@ebay/nice-modal-react';

import { useCallback, useState, useEffect } from 'react';
import { Button } from '../../src/components/Button/Button.component';
import DashboardLayout from '../../src/layouts/dashboard-layout/DashBoardLayout';
import withAuth from 'src/helpers/HOC/withAuth';
import { Table, TR } from '../../src/components/Table/Table.component';
import { Employee, PaginationMeta } from 'src/api/types';
import { $api } from 'src/api';

import Plus from '../../public/svgs/add-fill.svg';
import SearchInput from '../../public/svgs/search.svg';
import avatar from '../../public/images/avatar-img.png';
import moment from 'moment';
import { KebabMenu } from '@/components/KebabMenu/KebabMenu.component';
import { EmployeeFilterModal } from '@/components/Modals/EmployeeFilterModal.component';
import { IEmployeeFilter } from '@/components/types';
import { AddEmployeeModal } from '@/components/Modals/AddEmployeeModal.component';
import { HttpError } from 'src/api/repo/http.error';
import { toast } from 'react-toastify';

const EmployeeTab = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
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
  const [filter, setFilter] = useState<IEmployeeFilter>({});

  const refreshEmployees = useCallback(
    async (page = 1, perPage = 10, search = '', all = false) => {
      try {
        setIsLoading(true);
        const res = await $api.employee.getEmployees(
          page,
          perPage,
          search,
          all,
          filter.salaryRange,
          filter.status,
        );
        setEmployees(res.data);
        if (res.meta) {
          setPaginationMeta(res.meta);
        }
      } catch (error) {
        // error getting employees...
      } finally {
        setIsLoading(false);
      }
    },
    [setEmployees, filter],
  );

  const kebabHandler = (action: 'Delete' | 'Activate' | 'Deactivate') => {
    switch (action) {
      case 'Activate':
      case 'Deactivate': {
        return async (id: string | string[]) => {
          try {
            const ids = Array.isArray(id) ? id : [id];
            setIsLoading(true);
            await $api.employee.updateMultipleEmployeeStatuses(
              ids,
              action === 'Activate' ? 'active' : 'deactivated',
            );
            toast.success(`employee(s) ${action}d successfully`.toLowerCase());
            refreshEmployees();
          } catch (error) {
            const err = error as HttpError;
            toast.error(err.message);
          } finally {
            setIsLoading(false);
          }
        };
      }
      default:
        return async (id: string | string[]) => {
          try {
            const ids = Array.isArray(id) ? id : [id];
            setIsLoading(true);
            await $api.employee.removeMultipleEmployees(ids);
            toast.success(`employee(s) deleted successfully`);
            refreshEmployees();
          } catch (error) {
            const err = error as HttpError;
            toast.error(err.message);
          } finally {
            setIsLoading(false);
          }
        };
    }
  };

  useEffect(() => {
    refreshEmployees();
  }, [refreshEmployees]);

  return (
    <>
      <Head>
        <title>Employee Tab</title>
      </Head>
      <div className="employee-section">
        <Table
          headerRow={[
            'Name',
            'Email Address',
            'Amount (₦)',
            'Status',
            'Group',
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
          title={`${paginationMeta.total} Employee(s)`}
          onFilterClick={() =>
            NiceModal.show(EmployeeFilterModal, {
              filter,
              onFilter: setFilter,
            })
          }
          isEmpty={!employees.length}
          emptyStateText="No employee yet"
          isLoading={isLoading}
          kebabMenuItems={[
            { action: () => kebabHandler('Delete')(selected), value: 'Delete' },
            {
              action: () => kebabHandler('Activate')(selected),
              value: 'Activate',
            },
            {
              action: () => kebabHandler('Deactivate')(selected),
              value: 'Deactivate',
            },
          ]}
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
                        {employee.firstname} {employee.lastname}
                      </td>
                      <td>
                        <span className="email" title={employee.email}>
                          {employee.email}
                        </span>
                      </td>
                      <td>{employee.salary}</td>
                      <td>{employee.status}</td>
                      <td>
                        {employee.groups
                          .map((employeeGroup) => employeeGroup.group.name)
                          .join(', ')}
                      </td>
                      <td>
                        <div className="d-flex justify-content-space-between align-items-center">
                          <div>
                            {moment(employee.createdAt).format(
                              'MMM\xa0DD,\xa0YYYY',
                            )}
                            &nbsp;|&nbsp;
                            <span className="employee-section__employee_pay-time">
                              {moment(employee.createdAt).format('hh:MM\xa0A')}
                            </span>
                          </div>
                          <KebabMenu
                            items={[
                              {
                                action: () =>
                                  kebabHandler('Delete')(employee.id),
                                value: 'Delete',
                              },
                              {
                                action: () =>
                                  kebabHandler(
                                    employee.status === 'active'
                                      ? 'Deactivate'
                                      : 'Activate',
                                  )(employee.id),
                                value:
                                  employee.status === 'active'
                                    ? 'Deactivate'
                                    : 'Activate',
                              },
                            ]}
                          />
                        </div>
                      </td>
                    </TR>
                  );
                })}
              </tbody>
            );
          }}
        </Table>
      </div>
    </>
  );
};

const EmployeeGroup = () => {
  return (
    <div className="employee-group">
      <div className="employee-section__employeeSearch">
        <div className="employee-section__employeeHeader">
          {/* <p>30 Employee(s)</p> */}
          <p>0 Employee(s)</p>
        </div>
        <div className="employee-section__searchInput">
          <div className="employee-section__searchIcon">
            <div>
              <input
                type="text"
                placeholder="Search by name"
                className="employee-section__search"
              />
            </div>
            <div className="employee-section__searchImage">
              <Image src={SearchInput} alt="search-image" />
            </div>
          </div>
        </div>
      </div>

      <section className="employee-group__employee-group-cards">
        <div className="employee-group__section">
          <div className="employee-group__group-title">
            <h5 className="employee-group__header-title">Group Name Here</h5>

            <button className="employee-group__more-menu">
              <MoreMenuSVG />
            </button>
          </div>

          <Link href="/employees/group-details">
            <a className="employee-group__content">
              <p className="employee-group__date-created-name">Date Created</p>
              <p className="employee-group__date-time-created">
                September 16, 2021 | 12:40 PM{' '}
              </p>
              <hr />

              <p className="employee-group__salary-title">Common Salary</p>

              <div className="employee-group__salary-amount-section">
                <p className="employee-group__salary-amount">₦ 200,000</p>
                <div className="employee-group__group-images">
                  <Image
                    src={avatar}
                    alt="group-employee-image"
                    className="employee-image"
                  />
                  <Image src={avatar} alt="" className="employee-image" />
                  <Image
                    src={avatar}
                    alt="group-employee-image"
                    className="employee-image"
                  />
                  <Image
                    src={avatar}
                    alt="group-employee-image"
                    className="employee-image"
                  />
                </div>
              </div>
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
};

const EmployeePage: NextPage = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const handleTab1 = () => {
    setActiveTab('tab1');
  };
  const handleTab2 = () => {
    setActiveTab('tab2');
  };
  return (
    <DashboardLayout pageTitle="Employees">
      <div className="employee-section">
        <div className=" employee-section__details">
          <div className="employee-section__head">
            <h1 className="employee-section__title">Employee Settings</h1>

            <div className="employee-section__employee-button">
              <Button
                label=" Create Employee group"
                onClick={() => {}}
                className="employee-section__employee-button1"
                type="submit"
              />
              <Button
                label={
                  <>
                    <Image src={Plus} alt="plus icon" /> {'Add Employee'}
                  </>
                }
                onClick={() => NiceModal.show(AddEmployeeModal)}
                className="employee-section__submit-btn"
                primary
                type="submit"
              />
            </div>
          </div>
          <div className="employee-section__tabs">
            {/* Tab nav */}
            <ul className="employee-section__tab-nav">
              <li
                className={
                  activeTab === 'tab1' ? 'employee-section__active' : ''
                }
                onClick={handleTab1}
              >
                Employees
              </li>
              <li
                className={
                  activeTab === 'tab2' ? 'employee-section__active' : ''
                }
                onClick={handleTab2}
              >
                Group
              </li>
            </ul>
          </div>
          <div className="employee-section__tab-content">
            {activeTab === 'tab1' ? <EmployeeTab /> : <EmployeeGroup />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(EmployeePage, ['Employee', 'read']);

const MoreMenuSVG = () => (
  <svg
    width="3"
    height="12"
    viewBox="0 0 3 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.30621 0.5C0.633984 0.5 0.0839844 1.05 0.0839844 1.72222C0.0839844 2.39444 0.633984 2.94444 1.30621 2.94444C1.97843 2.94444 2.52843 2.39444 2.52843 1.72222C2.52843 1.05 1.97843 0.5 1.30621 0.5ZM1.30621 9.05556C0.633984 9.05556 0.0839844 9.60556 0.0839844 10.2778C0.0839844 10.95 0.633984 11.5 1.30621 11.5C1.97843 11.5 2.52843 10.95 2.52843 10.2778C2.52843 9.60556 1.97843 9.05556 1.30621 9.05556ZM1.30621 4.77778C0.633984 4.77778 0.0839844 5.32778 0.0839844 6C0.0839844 6.67222 0.633984 7.22222 1.30621 7.22222C1.97843 7.22222 2.52843 6.67222 2.52843 6C2.52843 5.32778 1.97843 4.77778 1.30621 4.77778Z"
      fill="#0D0F11"
    />
  </svg>
);

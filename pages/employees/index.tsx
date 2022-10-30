import NiceModal from '@ebay/nice-modal-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../../src/components/Button/Button.component';
import DashboardLayout from '../../src/layouts/dashboard-layout/DashBoardLayout';
import withAuth from 'src/helpers/HOC/withAuth';
import { Employee } from 'src/api/types';
import { $api } from 'src/api';
import { AddEmployeeModal } from '@/components/Modals/AddEmployeeModal.component';
import { CreateEmployeeGroupModal } from '@/components/Modals/CreateEmployeeGroupModal.component';
import { useAppSelector } from 'src/redux/hooks';
import { EmployeeTab } from '@/components/Employee/employee-tab.component';
import { Util } from 'src/helpers/util';
import { EmployeeGroup } from '@/components/Employee/employee-group-tab.component';
import { NextPage } from 'next';
import { PlusSvg } from '@/components/svg';
import { Tab } from '@/components/Tab/tab.component';
import { TabPane } from '@/components/Tab/tabpane.component';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import {
  MoreMenuHorizontalSVG,
  EditSquareSVG,
  Plus2Svg,
} from '@/components/svg';
import { Dropdown, Menu } from 'antd';

const EmployeePage: NextPage = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const [loading, setLoading] = useState(true);
  const [groupTabControl, setGroupTabControl] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [paginationMeta, setPaginationMeta] = useState(
    Util.getDefaultPaginationMeta({}),
  );
  const [employeeQuery, setEmployeeQuery] = useState<Record<string, any>>({});
  const router = useRouter();
  const { tab } = router.query;
  const selectedTab = Array.isArray(tab) ? tab[0] : tab || 'employees';

  const getEmployees = useCallback(
    async (
      page?: number,
      perPage?: number,
      search?: string,
      all?: boolean,
      filter?: Record<string, unknown>,
    ) => {
      try {
        setLoading(true);
        setEmployeeQuery({ page, perPage, search, all, filter });
        const res = await $api.employee.getEmployees({
          page,
          perPage,
          search,
          all,
          salaryRange: filter?.salaryRange,
          status: filter?.status,
        });
        setEmployees(res.data);
        if (res.meta) {
          setPaginationMeta(res.meta);
        }
      } catch (error) {
        // error getting employees...
      } finally {
        setLoading(false);
      }
    },
    [setEmployees],
  );

  const onAddEmployee = useCallback(() => {
    NiceModal.show(AddEmployeeModal, {
      administrator,
      gotoPayrollCreation: !employees.length,
    }).then(() => {
      const { page, perPage, search, all, filter } = employeeQuery;
      getEmployees(page, perPage, search, all, filter);
    });
  }, [administrator, employeeQuery, employees, getEmployees]);

  useEffect(() => {
    if (!loading && !employees.length) {
      onAddEmployee();
    }
  }, [loading, employees, onAddEmployee]);

  const onTabChange = (tab: string) => {
    const { pathname, query } = router;
    const url = stringifyUrl({
      url: pathname,
      query: { ...query, tab },
    });

    router.push(url);
  };

  const onCreateGroup = () => {
    NiceModal.show(CreateEmployeeGroupModal).then(() => {
      setGroupTabControl(!groupTabControl);
    });
  };

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <button className="employee-menu-list" onClick={onAddEmployee}>
          <Plus2Svg /> Add employee
        </button>
      </Menu.Item>

      <Menu.Item key="1">
        <button className="employee-menu-list" onClick={onCreateGroup}>
          <EditSquareSVG /> Create employee group
        </button>
      </Menu.Item>
    </Menu>
  );

  return (
    <DashboardLayout pageTitle="Employees">
      <div className="employee-section">
        <div className=" employee-section__details">
          <div className="employee-section__head">
            <h1 className="employee-section__title">Employee Settings</h1>
            <div className="employee-section__employee-button">
              <Button
                label="Create Employee Group"
                onClick={onCreateGroup}
                className="employee-section__employee-button1"
                type="submit"
              />
              <Button
                label={
                  <>
                    <PlusSvg />
                    &nbsp;{'Add\xa0Employee'}
                  </>
                }
                onClick={onAddEmployee}
                className="employee-section__submit-btn"
                primary
                type="submit"
              />
            </div>

            <Dropdown
              overlay={menu}
              trigger={['click']}
              overlayClassName="employee-dropdown"
            >
              <button className="employee-section__employee-menu">
                <MoreMenuHorizontalSVG />
              </button>
            </Dropdown>
          </div>

          <Tab
            onChange={onTabChange}
            active={selectedTab}
            default={'employees'}
          >
            <TabPane tab="Employees" key="employees">
              <EmployeeTab
                administrator={administrator}
                loading={loading}
                employees={employees}
                paginationMeta={paginationMeta}
                refreshEmployees={getEmployees}
              />
            </TabPane>
            <TabPane key="groups" tab="Groups">
              <EmployeeGroup refreshList={groupTabControl} />
            </TabPane>
          </Tab>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(EmployeePage, ['Employee', 'read']);

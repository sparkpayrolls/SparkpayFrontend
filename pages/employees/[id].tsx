import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NiceModal from '@ebay/nice-modal-react';
import DashboardLayout from '../../src/layouts/dashboard-layout/DashBoardLayout';
// import { EditEmployeeDetailsModal } from '@/components/Modals/EditDetailsModal.component';
import { AddonBonusModal } from '@/components/Modals/AddonBonusModal.component';
import withAuth from 'src/helpers/HOC/withAuth';
import BackIcon from '../../public/svgs/backicon.svg';
import EmployeeDetailsTab from '@/components/Employee/EmployeeDetailsTab'
import { Employee } from 'src/api/types';
import { IF } from '@/components/Misc/if.component';
import { NotFound } from '@/components/Misc/not-found.component';
import { useRouter } from 'next/router';
import useApiCall from 'src/helpers/hooks/useapicall.hook';
import { useAppSelector } from 'src/redux/hooks';
import {
  getEmployeeEditSubmitHandler,
  getEmployeeMethod,
} from 'src/helpers/methods';
import { Tab } from '@/components/Tab/tab.component';
import { TabPane } from '@/components/Tab/tabpane.component';
import { stringifyUrl } from 'query-string';
import EmployeeAddons from './../../src/components/Employee/employee-addons';


const EmployeeDetails: NextPage = () => {
  const router = useRouter();
  const administrator = useAppSelector((state) => state.administrator);
  const [eph, setEmployee] = useState<Employee>();
  const [notFound, setNotFound] = useState(false);
  const [load, apiCallStarted, apiCallDone] = useApiCall();

  const employeeId = router.query.id as string;
  const loading = load || !eph;
  const { tab } = router.query;
  const selectedTab = Array.isArray(tab) ? tab[0] : tab || 'employees';

  const getEmployee = useCallback(async () => {
    await getEmployeeMethod({
      employeeId,
      apiCallStarted,
      setEmployee,
      setNotFound,
      apiCallDone,
    })();
  }, [employeeId, apiCallDone, apiCallStarted]);


  useEffect(() => {
    getEmployee();
  }, [getEmployee, administrator]);

   const onTabChange = (tab: string) => {
     const { pathname, query } = router;
     const url = stringifyUrl({
       url: pathname,
       query: { ...query, tab },
     });

     router.push(url);
   };


  const onAddEmployee = () => {
    NiceModal.show(AddonBonusModal, {
      administrator,
      employee: eph,
      onSubmit: getEmployeeEditSubmitHandler(employeeId, getEmployee),
    });
  };

  return (
    <DashboardLayout pageTitle="Employee Details">
      <div className="employee-details">
        <div className=" employee-details__employee-details-settings">
          <div className="employee-details__employee-details-header">
            <Link href="/employees">
              <a>
                <Image
                  src={BackIcon}
                  alt="back-icon"
                  className="employee-details__back-icon"
                />
              </a>
            </Link>
            <h5 className="employee-details__employee-header">
              Employees Details
            </h5>
          </div>
          <IF condition={!notFound && !loading}>
            <button
              className="employee-details__employee-button"
              onClick={onAddEmployee}
            >
              Edit Details
            </button>
          </IF>
        </div>
        <IF condition={notFound}>
          <div className="employee-details__not-found">
            <NotFound message="Employee not found" />
          </div>
        </IF>{' '}
        <Tab onChange={onTabChange} active={selectedTab} default={'employees'}>
          <TabPane tab="Employee Details" key="employees">
            <EmployeeDetailsTab />
          </TabPane>
          <TabPane key="addons" tab="Addon Bonuses">
            <EmployeeAddons />
          </TabPane>
        </Tab>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(EmployeeDetails);


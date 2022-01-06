import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NiceModal from '@ebay/nice-modal-react';
import DashboardLayout from '../../src/layouts/dashboard-layout/DashBoardLayout';
import { EditDetailsModal } from '@/components/Modals/EditDetailsModal.component';
import withAuth from 'src/helpers/HOC/withAuth';
import BackIcon from '../../public/svgs/backicon.svg';
import { SingleDetail } from '@/components/Employee/single-detail.component';
import { Country, Employee } from 'src/api/types';
import { IF } from '@/components/Misc/if.component';
import { NotFound } from '@/components/Misc/not-found.component';
import { useRouter } from 'next/router';
import useApiCall from 'src/helpers/hooks/useapicall.hook';
import { HttpError } from 'src/api/repo/http.error';
import { $api } from 'src/api';
import moment from 'moment';
import { useAppSelector } from 'src/redux/hooks';
import { Util } from 'src/helpers/util';

const EmployeeDetails: NextPage = () => {
  const router = useRouter();
  const administrator = useAppSelector((state) => state.administrator);
  const [eph, setEmployee] = useState<Employee>();
  const [notFound, setNotFound] = useState(false);
  const [load, apiCallStarted, apiCallDone] = useApiCall();

  const employeeId = router.query.id as string;
  const loading = load || !eph;
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const salary = Util.formatMoneyNumber(eph?.salary ?? 0);

  const getEmployee = useCallback(async () => {
    try {
      if (!employeeId) {
        return;
      }

      apiCallStarted();
      const employee = await $api.employee.getSingleEmployee(employeeId);
      setEmployee(employee);
    } catch (error) {
      const err = error as HttpError;
      if (err.status === 404) {
        setNotFound(true);
      }
    } finally {
      apiCallDone();
    }
  }, [employeeId, apiCallDone, apiCallStarted]);

  useEffect(() => {
    getEmployee();
  }, [getEmployee, administrator]);

  const onAddEmployee = () => {
    NiceModal.show(EditDetailsModal, { administrator });
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
        </IF>
        <IF condition={!notFound}>
          <div className="employee-details__employee-settings-details">
            <div className="employee-details__employee-settings-flex">
              <div>
                <SingleDetail
                  title="Name"
                  details={`${eph?.firstname} ${eph?.lastname}`}
                  loading={loading}
                />
              </div>
              <div>
                <SingleDetail
                  title="Email Address"
                  details={eph?.email}
                  loading={loading}
                />
              </div>
              <div>
                <SingleDetail
                  title="Group(s)"
                  details={eph?.groups
                    ?.map((group) => group.group.name)
                    ?.join(', ')}
                  loading={loading}
                />
              </div>
              <div>
                <SingleDetail
                  title="Date Created"
                  details={moment(eph?.createdAt).format('MMMM DD, YYYY')}
                  loading={loading}
                />
              </div>
            </div>
            <hr />

            <div className="employee-details__employee-settings-flex">
              <div>
                <SingleDetail
                  title="Salary Amount"
                  details={`${currency} ${salary}`}
                  loading={loading}
                />
              </div>
              <div>
                <SingleDetail
                  title="Country"
                  details={(eph?.country as Country)?.name}
                  loading={loading}
                />
              </div>
            </div>
            <hr />
          </div>
        </IF>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(EmployeeDetails);

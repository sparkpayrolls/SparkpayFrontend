import NiceModal from '@ebay/nice-modal-react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { Administrator } from 'src/api/types';
import { EmployeeFilterModal } from '../Modals/EmployeeFilterModal.component';
import { EmployeeTable } from '../Table/employee-table.component';
import { IEmployeeFilter, IEmployeeTab } from '../types';
import { confirmation } from '../Modals/ConfirmationModal.component';

export const EmployeeTab = (props: IEmployeeTab) => {
  const {
    administrator,
    loading,
    employees,
    paginationMeta,
    refreshEmployees,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<IEmployeeFilter>({});

  const onDelete = async (id: string | string[]) => {
    if (!loading) {
      const shouldDelete = await confirmation({
        title: 'Delete employee',
        text: 'Are you sure you want to permanently delete this employee?',
      });
      if (shouldDelete) {
        try {
          const ids = Array.isArray(id) ? id : [id];
          setIsLoading(true);
          await $api.employee.removeMultipleEmployees(ids);
          toast.success(`employee(s) deleted successfully`, {
            position: 'bottom-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          refreshEmployees();
        } catch (error) {
          const err = error as HttpError;
          toast.error(err.message);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const onStatusToggle = (action: 'Activate' | 'Deactivate') => async (
    id: string | string[],
  ) => {
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

  const onSendOnboardingLink = async (id: string | string[]) => {
    try {
      setIsLoading(true);
      await $api.employee.resendOnboardingLink(id);
      toast.success(`onboarding link resent successfully`);
    } catch (error) {
      const err = error as HttpError;
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onFilter = () => {
    NiceModal.show(EmployeeFilterModal, {
      filter,
      onFilter: setFilter,
    });
  };

  useEffect(() => {
    refreshEmployees(undefined, undefined, undefined, undefined, filter);
  }, [refreshEmployees, administrator, filter]);

  return (
    <>
      <Head>
        <title>Employees</title>
      </Head>
      <div className="employee-section">
        <EmployeeTable
          employees={employees}
          getEmployees={refreshEmployees}
          paginationMeta={paginationMeta}
          onFilter={onFilter}
          loading={isLoading || !!loading}
          administrator={administrator as Administrator}
          onDelete={onDelete}
          onStatusToggle={onStatusToggle}
          onSendOnboardingLink={onSendOnboardingLink}
        />
      </div>
    </>
  );
};

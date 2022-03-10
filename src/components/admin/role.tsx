import { AdminRoleTable } from './../Table/admin-role-table';
import { IRoleTab } from '../types';
import { EmployeeFilterModal } from '../Modals/EmployeeFilterModal.component';
import NiceModal from '@ebay/nice-modal-react';
import { useState } from 'react';
import { IEmployeeFilter } from '../types';

const AdminRole = (props: IRoleTab) => {
  const {
    loading,
  } = props;

  const [isLoading] = useState(false);
  const [filter, setFilter] = useState<IEmployeeFilter>({});

  const onFilter = () => {
    NiceModal.show(EmployeeFilterModal, {
      filter,
      onFilter: setFilter,
    });
  };

  return (
    <section className="employee-section">
      <AdminRoleTable
        onFilter={onFilter}
        loading={isLoading || !!loading}
      />
    </section>
  );
};

export default AdminRole;

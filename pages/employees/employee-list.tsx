import DashboardLayoutV2 from '../../src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import withAuth from 'src/helpers/HOC/withAuth';
import { EmployeeList } from '@/components/employee-list.component/employee-list.component';

function EmployeeListPage() {
  return (
    <DashboardLayoutV2 title="Employee list" href="/employees">
      <EmployeeList />
    </DashboardLayoutV2>
  );
}

export default withAuth(EmployeeListPage, ['Employee', 'write']);

import withAuth from 'src/helpers/HOC/withAuth';
import { EmployeeList } from '@/components/employee-list.component/employee-list.component';

function EmployeeListPage() {
  return <EmployeeList />;
}

export default withAuth(EmployeeListPage, ['Employee', 'write']);

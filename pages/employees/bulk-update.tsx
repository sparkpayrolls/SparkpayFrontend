import withAuth from 'src/helpers/HOC/withAuth';
import { BulkEmployeeUpdate } from '@/components/bulk-employee-update.component/bulk-employee-update.component';

function BulkUpdatePage() {
  return <BulkEmployeeUpdate />;
}

export default withAuth(BulkUpdatePage, ['Employee', 'write']);

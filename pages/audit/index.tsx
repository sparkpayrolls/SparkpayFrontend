import Head from 'next/head';
import type { NextPage } from 'next';
import DashboardLayout from '../../src/layouts/dashboard-layout/DashBoardLayout';
import { AuditTable } from '@/components/Table/audit-table';
import withAuth from 'src/helpers/HOC/withAuth';

const AuditTrail: NextPage = () => {
  return (
    <>
      <DashboardLayout pageTitle="audit-trail">
        <div className="audit-trail">
          <Head>
            <title>Audit Trail</title>
          </Head>
          <div className="audit-trail__head">
            <h1 className="audit-trail__title">Audit Trail</h1>
          </div>
          <div className="audit-trail__table-section">
            <AuditTable />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default withAuth(AuditTrail, ['AuditTrail', 'read']);

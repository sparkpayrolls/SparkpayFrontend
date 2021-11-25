import Head from 'next/head';
import type { NextPage } from 'next';
import DashboardLayout from '../../src/layouts/dashboard-layout/DashBoardLayout';
import { CreateAuditTrailButton } from '@/components/Button/create-audit-trail-btn';
import { AuditTable } from '@/components/Table/audit-table';

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
            <div className="audit-trail__employee-button">
              <CreateAuditTrailButton />
            </div>
          </div>
          <div className="audit-trail__table-section">
            <AuditTable />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AuditTrail;

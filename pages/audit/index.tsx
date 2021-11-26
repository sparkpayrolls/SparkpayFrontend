import Head from 'next/head';
import type { NextPage } from 'next';
import DashboardLayout from '../../src/layouts/dashboard-layout/DashBoardLayout';
import { CreateAuditTrailButton } from '@/components/Button/create-audit-trail-btn';
import { AuditTable } from '@/components/Table/audit-table';
import { useCallback, useState, useEffect } from 'react';
import { Audit } from 'src/api/types';
import { Util } from 'src/helpers/util';
import { $api } from 'src/api';
import withAuth from 'src/helpers/HOC/withAuth';
import { useAppSelector } from 'src/redux/hooks';

const AuditTrail: NextPage = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const [logs, setLogs] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState(Util.getDefaultPaginationMeta({}));

  const getLogs = useCallback(
    async (params: Record<string, any>) => {
      try {
        setLoading(true);
        const { data: logs, meta } = await $api.audit.getLogs(params);

        setLogs(logs);
        setMeta(meta as any);
      } catch (error) {
        // ...
      } finally {
        setLoading(false);
      }
    },
    [setLogs],
  );

  useEffect(() => {
    getLogs({ perPage: 10 });
  }, [getLogs, administrator]);

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
            <AuditTable
              loading={loading}
              meta={meta}
              logs={logs}
              getLogs={getLogs}
            />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default withAuth(AuditTrail, ['AuditTrail', 'read']);

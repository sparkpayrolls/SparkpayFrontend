import Head from 'next/head';
import type { NextPage } from 'next';
import DashboardLayout from '../../src/layouts/dashboard-layout/DashBoardLayout';
import { OrganizationTable } from '@/components/Table/organization-table';
import { useEffect, useState, useCallback } from 'react';
import { Util } from 'src/helpers/util';
import { Administrator, Company } from 'src/api/types';
import { $api } from 'src/api';
import { toast } from 'react-toastify';
import { HttpError } from 'src/api/repo/http.error';
import withAuth from 'src/helpers/HOC/withAuth';
import { CreateOrganisationButton } from '@/components/Button/create-organisation-button.component';
import { useAppDispatch } from 'src/redux/hooks';
import { refreshCompanies } from 'src/redux/slices/companies/companies.slice';
import 'antd/dist/antd.css';
import { Tabs } from 'antd';
import InvitationTab from "../../src/components/invitation";



const { TabPane } = Tabs;

function callback(key: any) {
  console.log(key);
}

const OrganizationSettings: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [{ data, meta }, setData] = useState({
    data: [] as Administrator[],
    meta: Util.getDefaultPaginationMeta({}),
  });
  const [query, setQuery] = useState({} as Record<string, any>);
  const dispatch = useAppDispatch();

  const getOrganizations = useCallback(
    async (query: Record<string, any>) => {
      setLoading(true);
      try {
        setQuery(query);
        const res = await $api.company.getCompaniesPaginated(query);

        setData((i) => res as typeof i);
      } catch (error) {
        // error getting orgs...
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setData, setQuery],
  );

  const deleteOrganization = async (id: string) => {
    if (!loading) {
      setLoading(true);
      const clone = data.map((d) => ({ ...d }));
      try {
        setData({
          meta,
          data: data.filter((d) => (d.company as Company).id !== id),
        });
        await $api.company.deleteCompany(id);
        getOrganizations(query);
        refreshCompanies(dispatch);
        toast.success('company deleted successfully');
      } catch (error) {
        const err = error as HttpError;
        toast.error(err.message);
        setData({ meta, data: clone });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getOrganizations({});
  }, [getOrganizations]);

  return (
    <>
      <DashboardLayout pageTitle="Organisations">
        <div className="organisation">
          <Head>
            <title>Organisations</title>
          </Head>
          <div className="employee-section__head">
            <h1 className="employee-section__title">Organisations</h1>

            <div className="employee-section__employee-button">
              <CreateOrganisationButton
                onCreate={() => getOrganizations(query)}
              />
            </div>
          </div>
            <Tabs defaultActiveKey="1" onChange={callback}>
              <TabPane tab="Organizations" key="1">
                <div className="organisation__table-section">
                  <OrganizationTable
                    organizations={data}
                    paginationMeta={meta}
                    getOrganizations={getOrganizations}
                    deleteOrganisation={deleteOrganization}
                    loading={loading}
                  />
                  </div>
              </TabPane>
              <TabPane tab="Invitations" key="2">              
                <InvitationTab
                 />
              </TabPane>

            </Tabs>
          </div>

      </DashboardLayout>
    </>
  );
};

export default withAuth(OrganizationSettings);

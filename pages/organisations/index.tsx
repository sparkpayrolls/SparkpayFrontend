import Head from 'next/head';
import Image from 'next/image';
import type { NextPage } from 'next';
import NiceModal from '@ebay/nice-modal-react';
import { Button } from '../../src/components/Button/Button.component';
import DashboardLayout from '../../src/layouts/dashboard-layout/DashBoardLayout';
import Plus from '../../public/svgs/add-fill.svg';
import { OrganizationTable } from '@/components/Table/organization-table';
import { useEffect, useState, useCallback } from 'react';
import { Util } from 'src/helpers/util';
import { Administrator, Company } from 'src/api/types';
import { $api } from 'src/api';
import { toast } from 'react-toastify';
import { HttpError } from 'src/api/repo/http.error';
import { CreateOrgnizationModal } from '@/components/Modals/CreateOrganizationModal.component';
import withAuth from 'src/helpers/HOC/withAuth';
import { refreshCompanies } from 'src/redux/slices/companies/companies.slice';
import { useAppDispatch } from 'src/redux/hooks';

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
            <title></title>
          </Head>
          <div className="employee-section__head">
            <h1 className="employee-section__title">Organisations</h1>

            <div className="employee-section__employee-button">
              <Button
                label={
                  <>
                    <Image src={Plus} alt="plus icon" /> {'Create Organisation'}
                  </>
                }
                onClick={() =>
                  NiceModal.show(CreateOrgnizationModal).then(() => {
                    getOrganizations(query);
                    refreshCompanies(dispatch);
                  })
                }
                className="employee-section__submit-btn"
                primary
                type="submit"
              />
            </div>
          </div>
          <div className="organisation__table-section">
            <OrganizationTable
              organizations={data}
              paginationMeta={meta}
              getOrganizations={getOrganizations}
              deleteOrganisation={deleteOrganization}
              loading={loading}
            />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default withAuth(OrganizationSettings);

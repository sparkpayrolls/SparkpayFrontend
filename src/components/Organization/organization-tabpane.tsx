import { useCallback, useEffect, useState } from 'react';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { Administrator, Company } from 'src/api/types';
import { Util } from 'src/helpers/util';
import { useAppDispatch } from 'src/redux/hooks';
import { refreshCompanies } from 'src/redux/slices/companies/companies.slice';
import { OrganizationTable } from '../Table/organization-table';
import { Modal } from 'antd';


interface IOrganizationTabPane {
  trigger?: string;
}

export const OrganizationTabPane = (props: IOrganizationTabPane) => {
  const { trigger } = props;
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [{ data, meta }, setData] = useState({
    data: [] as Administrator[],
    meta: Util.getDefaultPaginationMeta({}),
  });
  const [query, setQuery] = useState({} as Record<string, any>);
  const dispatch = useAppDispatch();

  const getOrganizations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await $api.company.getCompaniesPaginated(query);

      setData((i) => res as typeof i);
    } catch (error) {
      // error getting orgs...
    } finally {
      setLoading(false);
    }
  }, [setLoading, setData, query]);

  const deleteOrganization = async (id: string) => {
    showModal()
    const toast = (await import('react-toastify')).toast;
    if (!loading) {
      setLoading(true);
      const clone = data.map((d) => ({ ...d }));
      try {
        setData({
          meta,
          data: data.filter((d) => (d.company as Company).id !== id),
        });
        await $api.company.deleteCompany(id);
        getOrganizations();
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
    getOrganizations();
  }, [getOrganizations, trigger]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="organisation__table-section">
      <OrganizationTable
        organizations={data}
        paginationMeta={meta}
        getOrganizations={setQuery}
        deleteOrganisation={deleteOrganization}
        loading={loading}
      />
<Modal title="Warning" 
visible={isModalVisible} 
onOk={handleOk} 
onCancel={handleCancel} 
okText="Delete"
 className="modalStyle">
        <p className="organization-text-modal">You are about to delete this organzation, click on delete to continue?</p>
      </Modal>
    </div>

  );
};


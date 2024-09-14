import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import NiceModal from '@ebay/nice-modal-react';
import useApiCall from './useapicall.hook';
import { useCallback, useEffect, useState } from 'react';
import {
  Company,
  Country,
  PensionFundAdministrator,
  State,
} from 'src/api/types';
import { Util } from '../util';
import { $api } from 'src/api';
import { toast } from 'react-toastify';
import moment from 'moment';
import { refreshCompanies } from 'src/redux/slices/companies/companies.slice';
import { OrganisationDetailsModal } from '@/components/Modals/OrganisationDetailsModal.component';

export const useStates = () => {
  const [states, setStates] = useState<State[]>([]);
  const administrator = useAppSelector((state) => state.administrator);
  const country = (administrator?.company as Company)?.country as Country;

  useEffect(() => {
    $api.country
      .getStates(country?.id || '', { all: true })
      .then(({ data: states }) => {
        setStates(states);
      })
      .catch(() => {
        // do nothing...
      });
  }, [country?.id]);

  return { states };
};

export const usePFAs = () => {
  const [pfas, setPFAs] = useState<PensionFundAdministrator[]>([]);
  const administrator = useAppSelector((state) => state.administrator);
  const country = (administrator?.company as Company)?.country as Country;

  useEffect(() => {
    $api.country
      .getPFAs(country?.id || '', { all: true })
      .then(({ data: pfas }) => {
        setPFAs(pfas);
      })
      .catch(() => {
        // do nothing...
      });
  }, [country?.id]);

  return { pfas };
};

export const useOrganizationDetails = () => {
  const [loading, apiCallStarted, apiCallDone] = useApiCall();
  const { pfas } = usePFAs();
  const administrator = useAppSelector((state) => state.administrator);
  const country = (administrator?.company as Company)?.country as Country;
  const [organization, setOrganization] = useState<Company | null>();
  const { states } = useStates();

  const dispatch = useAppDispatch();
  const organisationId = (administrator?.company as Company)?.id;
  const canEdit = Util.canActivate([['Company', 'write']], administrator);

  const getOrganization = useCallback(async () => {
    try {
      apiCallStarted();
      if (!organisationId) {
        return;
      }

      const organization = await $api.company.getCompanyById(organisationId);
      setOrganization(organization);
    } catch (error) {
      Util.onNonAuthError(error, (httpError) => {
        if (httpError.status === 404) {
          setOrganization(null);
          return;
        }

        toast.error(httpError.message);
      });
    } finally {
      apiCallDone();
    }
  }, [organisationId, apiCallStarted, apiCallDone]);

  const onEditDetails = async () => {
    if (canEdit) {
      NiceModal.show(OrganisationDetailsModal, {
        organization,
      }).then(() => {
        getOrganization();
        refreshCompanies(dispatch);
      });
    }
  };

  useEffect(() => {
    getOrganization();
  }, [country?.id, getOrganization]);

  return {
    onEditDetails,
    loading,
    organization,
    canEdit,
    moment,
    states,
    pfas,
  };
};

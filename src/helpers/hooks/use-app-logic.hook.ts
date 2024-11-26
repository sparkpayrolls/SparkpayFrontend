import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { Administrator, Company, Country } from 'src/api/types';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { commitAministrator } from 'src/redux/slices/administrator/administrator.slice';
import { commitCompanies } from 'src/redux/slices/companies/companies.slice';
import { commitUser, logOut } from 'src/redux/slices/user/user.slice';
import { useSocket } from './use-socket.hook';
import useApiCall from './useapicall.hook';
import { config } from '../config';
import { getCountries } from 'src/redux/slices/countries/countries.slice';
import { commitSelectedCountry } from 'src/redux/slices/selected-country/selected-country.slice';

export const useAppLogic = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const [loading, startLoading, stopLoading] = useApiCall(1);
  const { countries, administrator, selectedCountry } = useAppSelector(
    (state) => ({
      countries: state.countries,
      administrator: state.administrator,
      selectedCountry: state.selectedCountry,
    }),
  );

  useEffect(() => {
    const token = Cookies.get('auth_token');
    $api.registerInterceptors(token as string, dispatch);
    stopLoading();
  }, [dispatch, stopLoading]);

  useEffect(() => {
    startLoading();
    const loadAuth = () => {
      if (config().apiUrl)
        Promise.all([
          $api.user.getProfile(),
          $api.company.getCompanies(),
          $api.company.getCurrentCompany(),
        ])
          .then(([user, companies, administrator]) => {
            dispatch(commitUser(user));
            dispatch(commitCompanies(companies));
            dispatch(commitAministrator(administrator));
          })
          .catch(() => {
            /** */
          })
          .finally(stopLoading);
      else setTimeout(loadAuth, 500);
    };
    loadAuth();
  }, [dispatch, startLoading, stopLoading]);

  useEffect(() => {
    if (!countries.length && config().apiUrl) {
      getCountries(dispatch);
    }

    if (!selectedCountry && administrator) {
      dispatch(
        commitSelectedCountry(
          (administrator.company as Company).country as Country,
        ),
      );
    }
  }, [dispatch, countries, administrator, selectedCountry]);

  useEffect(() => {
    const { 'email-verification-code': code } = router.query;
    if (code) {
      startLoading();
      $api.auth
        .verifyEmail(code as string)
        .then(({ user, ...authDetails }) => {
          Cookies.set('auth_token', authDetails.accessToken);
          Cookies.set('auth_details', JSON.stringify(authDetails));
          $api.registerInterceptors(authDetails.accessToken, dispatch);
          dispatch(commitUser(user));
          toast.success('Email verified');
          router.replace('/overview');
        })
        .catch(() => {
          // error verifying user...
        })
        .finally(stopLoading);
    }
  }, [dispatch, router, startLoading, stopLoading]);

  useEffect(() => {
    if (socket) {
      socket.on('ProfileUpdate', (data) => {
        if (data.deleted) {
          logOut(dispatch);
          return;
        }
        dispatch(commitUser(data));
      });
      socket.on('CompaniesUpdate', (data: Administrator[]) => {
        const administrator = data.find((a) => a.selected) ?? null;
        dispatch(commitCompanies(data));
        dispatch(commitAministrator(administrator));
      });
    }
  }, [dispatch, socket]);

  return { loading };
};

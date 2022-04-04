import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/antd.css';
import '../src/styles/globals.scss';
import { AppProps } from 'next/app';
import { toast, ToastContainer, Slide } from 'react-toastify';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store';
import NiceModal from '@ebay/nice-modal-react';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { $api } from 'src/api';
import { commitUser, logOut } from 'src/redux/slices/user/user.slice';
import { commitAministrator } from 'src/redux/slices/administrator/administrator.slice';
import {
  commitCompanies,
  refreshCompanies,
} from 'src/redux/slices/companies/companies.slice';
import { AxiosError } from 'axios';
import { Company } from 'src/api/types';
import { Detector } from 'react-detect-offline';
import { Util } from 'src/helpers/util';
import { useRouter } from 'next/router';

let persistor = persistStore(store);
let lastStatus = true;

const AuthManager = () => {
  const { user, companies, administrator } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const authToken = Cookies.get('auth_token') as string;
    const tokenInterceptor = $api.$axios.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${authToken}`;
      return config;
    });

    return () => {
      $api.$axios.interceptors.request.eject(tokenInterceptor);
    };
  }, [user]);

  useEffect(() => {
    const authInterceptor = $api.$axios.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response?.status === 401) {
          logOut(dispatch);
          Util.redirectToLogin(router);
        }

        return Promise.reject(error);
      },
    );

    const permitInterceptor = $api.$axios.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        if (error.response?.status === 403) {
          dispatch(commitAministrator(null));
          refreshCompanies(dispatch);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      $api.$axios.interceptors.request.eject(authInterceptor);
      $api.$axios.interceptors.request.eject(permitInterceptor);
    };
  }, [dispatch, router]);

  useEffect(() => {
    const authToken = Cookies.get('auth_token') as string;
    if (authToken) {
      $api.user
        .getProfile()
        .then((newUser) => {
          if (!Util.deepEquals(newUser, user)) {
            dispatch(commitUser(newUser));
          }
        })
        .catch(() => {});
    } else {
      dispatch(commitUser(null));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      $api.company
        .getCompanies()
        .then((newCompanies) => {
          if (!Util.deepEquals(newCompanies, companies)) {
            dispatch(commitCompanies(newCompanies));
          }
        })
        .catch(() => {});
    }
  }, [dispatch, user, companies]);

  useEffect(() => {
    if (companies.length) {
      const companySelected = companies.find((company) => company.selected);
      const selectedCompany = companySelected?.company as Company;
      if (!selectedCompany) {
        dispatch(commitAministrator(null));
      }
    }
  }, [dispatch, companies]);

  useEffect(() => {
    if (companies.length) {
      $api.company
        .getCurrentCompany()
        .then((newAdministrator) => {
          if (
            !newAdministrator ||
            !Util.deepEquals(newAdministrator, administrator)
          ) {
            dispatch(
              commitAministrator(newAdministrator ? newAdministrator : null),
            );
          }
        })
        .catch(() => {});
    }
  }, [dispatch, companies, administrator]);

  return (
    <Detector
      render={({ online }) => {
        if (lastStatus === online) {
          return null;
        }
        lastStatus = online;
        if (online) {
          toast.dismiss('online-false');
        }

        toast(online ? 'You are back online' : 'You are currently offline', {
          toastId: `online-${online}`,
          autoClose: online ? 3000 : false,
          draggable: online,
          closeOnClick: online,
          closeButton: online,
          delay: online ? 600 : 0,
          pauseOnFocusLoss: false,
          pauseOnHover: false,
          position: 'top-center',
          type: online ? 'success' : 'warning',
          transition: Slide,
        });
        return null;
      }}
    />
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NiceModal.Provider>
            <AuthManager />
            <Component {...pageProps} />
            <ToastContainer hideProgressBar={true} autoClose={3000} />
          </NiceModal.Provider>
        </PersistGate>
      </Provider>
    </>
  );
}
export default MyApp;

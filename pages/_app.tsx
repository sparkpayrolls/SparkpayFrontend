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
import { PropsWithChildren, useEffect, useState } from 'react';
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
import useApiCall from 'src/helpers/hooks/useapicall.hook';

let persistor = persistStore(store);
let lastStatus = true;

const AuthManager = (props: PropsWithChildren<unknown>) => {
  const { user, companies, administrator } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, startLoading, stopLoading] = useApiCall();
  const [hasSetupAuth, setHasSetupAuth] = useState(false);

  useEffect(() => {
    const authToken = Cookies.get('auth_token') as string;
    let authTokenInterceptor: number;
    let authErrorHandlerInterceptor: number;
    let forbiddenErrorHandlerInterceptor: number;
    if (authToken) {
      authTokenInterceptor = $api.$axios.interceptors.request.use((config) => {
        return {
          ...config,
          headers: {
            ...(config?.headers || {}),
            Authorization: `Bearer ${authToken}`,
          },
        };
      });
      authErrorHandlerInterceptor = $api.$axios.interceptors.response.use(
        (res) => res,
        (error) => {
          if (error.response?.status === 401) {
            logOut(dispatch);
          }

          return Promise.reject(error);
        },
      );
      forbiddenErrorHandlerInterceptor = $api.$axios.interceptors.response.use(
        (res) => res,
        (error: AxiosError) => {
          if (error.response?.status === 403) {
            dispatch(commitAministrator(null));
            refreshCompanies(dispatch);
          }
          return Promise.reject(error);
        },
      );
    }
    setHasSetupAuth(true);

    return () => {
      $api.$axios.interceptors.request.eject(authTokenInterceptor);
      $api.$axios.interceptors.response.eject(authErrorHandlerInterceptor);
      $api.$axios.interceptors.response.eject(forbiddenErrorHandlerInterceptor);
    };
  }, [dispatch, user]);

  useEffect(() => {
    const authToken = Cookies.get('auth_token') as string;
    if (authToken) {
      startLoading();
      $api.user
        .getProfile()
        .then((newUser) => {
          if (!Util.deepEquals(newUser, user)) {
            dispatch(commitUser(newUser));
          }
        })
        .catch(() => {})
        .finally(stopLoading);
    } else {
      dispatch(commitUser(null));
    }
  }, [dispatch, startLoading, stopLoading, user]);

  useEffect(() => {
    if (user) {
      startLoading();
      $api.company
        .getCompanies()
        .then((newCompanies) => {
          if (!Util.deepEquals(newCompanies, companies)) {
            dispatch(commitCompanies(newCompanies));
          }
        })
        .catch(() => {})
        .finally(stopLoading);
    }
  }, [dispatch, user, companies, startLoading, stopLoading]);

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
      startLoading();
      $api.company
        .getCurrentCompany()
        .then((newAdministrator) => {
          if (
            (!newAdministrator && administrator) ||
            !Util.deepEquals(newAdministrator, administrator)
          ) {
            dispatch(
              commitAministrator(newAdministrator ? newAdministrator : null),
            );
          }
        })
        .catch(() => {})
        .finally(stopLoading);
    }
  }, [dispatch, companies, administrator, startLoading, stopLoading]);

  useEffect(() => {
    const { 'email-verification-code': code } = router.query;
    if (user && !user?.emailVerified && code) {
      startLoading();
      $api.auth
        .verifyEmail(code as string)
        .then(({ user, token }) => {
          Cookies.set('auth_token', token);
          dispatch(commitUser(user));
          toast.success('Email verified');
          router.replace('/');
        })
        .catch(() => {
          // error verifying user...
        })
        .finally(stopLoading);
    }
  }, [user, router, dispatch, startLoading, stopLoading]);

  return (
    <>
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
      {loading || !hasSetupAuth ? (
        <div className="app-loader">
          {
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/logo-icon.svg" alt="logo-loader" />
          }
        </div>
      ) : (
        props.children
      )}
    </>
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
            <AuthManager>
              <Component {...pageProps} />
            </AuthManager>
            <ToastContainer hideProgressBar={true} autoClose={3000} />
          </NiceModal.Provider>
        </PersistGate>
      </Provider>
    </>
  );
}
export default MyApp;

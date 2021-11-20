import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/antd.css';
import '../src/styles/globals.scss';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store';
import NiceModal from '@ebay/nice-modal-react';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { $api } from 'src/api';
import { commitUser } from 'src/redux/slices/user/user.slice';
import { commitAministrator } from 'src/redux/slices/administrator/administrator.slice';
import { refreshCompanies } from 'src/redux/slices/companies/companies.slice';
import { getCurrentAdministrator } from 'src/redux/slices/administrator/administrator.slice';

let persistor = persistStore(store);

const AuthManager = () => {
  const { user, companies } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const authToken = Cookies.get('auth_token') as string;
    const isLoggedIn = !!user;
    if (authToken) {
      $api.$axios.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${authToken}`;

        return config;
      });

      $api.$axios.interceptors.response.use(
        (res) => res,
        (error) => {
          if (error.response?.status === 401) {
            Cookies.remove('auth_token');
            dispatch(commitUser(null));
          }

          return Promise.reject(error);
        },
      );

      if (!isLoggedIn) {
        $api.user
          .getProfile()
          .then((user) => {
            dispatch(commitUser(user));
          })
          .catch(() => {
            // error logging in...
            Cookies.remove('auth_token');
          });
      } else {
        refreshCompanies(dispatch);
      }
    }

    if (!authToken && isLoggedIn) {
      dispatch(commitUser(null));
    }
  }, [user, dispatch]);

  useEffect(() => {
    const companySelected = companies.some((company) => company.selected);
    if (!!user && companySelected) {
      getCurrentAdministrator(dispatch);
    } else {
      dispatch(commitAministrator(null));
    }
  }, [companies, user, dispatch]);

  return null;
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

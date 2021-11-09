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

let persistor = persistStore(store);

const AuthManager = () => {
  const { user } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const authToken = Cookies.get('auth_token') as string;

    if (authToken) {
      const isLoggedIn = !!user;

      $api.$axios.defaults.headers.Authorization = `Bearer ${authToken}`;

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
      }
    }

    const authinterceptor = $api.$axios.interceptors.response.use((res) => {
      if (res.status === 401) {
        Cookies.remove('auth_token');
        dispatch(commitUser(null));
      }

      return res;
    });

    return () => {
      $api.$axios.interceptors.response.eject(authinterceptor);
    };
  }, [user, dispatch]);

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
            <Component {...pageProps} />
            <AuthManager />
            <ToastContainer hideProgressBar={true} autoClose={3000} />
          </NiceModal.Provider>
        </PersistGate>
      </Provider>
    </>
  );
}
export default MyApp;

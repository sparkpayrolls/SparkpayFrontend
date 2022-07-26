import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/antd.css';
import '../src/styles/globals.scss';
import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store';
import NiceModal from '@ebay/nice-modal-react';
import { PersistGate, PersistGateProps } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { PropsWithChildren } from 'react';
import { Detector } from 'react-detect-offline';
import { useAppLogic } from 'src/helpers/hooks/use-app-logic.hook';

let persistor = persistStore(store);
const AuthManager = (props: PropsWithChildren<unknown>) => {
  const { loading, renderDetectOnline } = useAppLogic();

  if (typeof window === 'undefined') {
    return <>{props.children}</>;
  }

  return (
    <>
      <Detector render={renderDetectOnline} />
      {loading ? (
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

const PersistGateWrapper = (props: PersistGateProps) => {
  if (typeof window === 'undefined') {
    return <>{props.children}</>;
  }

  return <PersistGate {...props} />;
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
        <PersistGateWrapper loading={null} persistor={persistor}>
          <NiceModal.Provider>
            <AuthManager>
              <Component {...pageProps} />
            </AuthManager>
            <ToastContainer hideProgressBar={true} autoClose={3000} />
          </NiceModal.Provider>
        </PersistGateWrapper>
      </Provider>
    </>
  );
}
export default MyApp;

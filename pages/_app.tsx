import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/antd.css';
import '../src/styles/globals.scss';
import { AppProps } from 'next/app';
import Router from 'next/router';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store';
import NiceModal from '@ebay/nice-modal-react';
import { PersistGate, PersistGateProps } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { PropsWithChildren, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { $api } from 'src/api';
import { useAppDispatch } from 'src/redux/hooks';
import { useAppLogic } from 'src/helpers/hooks/use-app-logic.hook';
import { config } from 'src/helpers/config';

let persistor = persistStore(store);

const AppLoader = () => (
  <div className="app-loader">
    {
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/logo-icon.svg" alt="logo-loader" />
    }
  </div>
);

// Public marketing pages. Nobody on these is signed in, so the session lookup
// below can only fail for them — and until it settles the whole page is a
// spinner. Measured on production before this change: first contentful paint
// 1744ms, and that first paint was the loader, not the page.
const MARKETING_ROUTES = new Set([
  '/',
  '/product',
  '/pricing',
  '/about',
  '/security',
  '/contact',
  '/request-access',
  '/request-received',
  '/404',
]);
const MARKETING_PREFIXES = ['/features/', '/legal/'];

// Marketing pages that do call the API, so they still wait for the runtime
// config — but never for a session. /book-a-demo loads availability on mount.
const MARKETING_API_ROUTES = new Set(['/book-a-demo']);

export const isMarketingRoute = (pathname: string) =>
  MARKETING_ROUTES.has(pathname) ||
  MARKETING_PREFIXES.some((prefix) => pathname.startsWith(prefix));

export const isMarketingApiRoute = (pathname: string) =>
  MARKETING_API_ROUTES.has(pathname);

// Registers the axios interceptors without fetching a session. /book-a-demo
// needs the request headers to look exactly as they did before, but has no use
// for a profile, a company list or the current administrator.
const ApiInterceptors = (props: PropsWithChildren<unknown>) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    $api.registerInterceptors(Cookies.get('auth_token') as string, dispatch);
  }, [dispatch]);

  return <>{props.children}</>;
};

const AuthManager = (props: PropsWithChildren<unknown>) => {
  const { loading } = useAppLogic();

  if (typeof window === 'undefined') {
    return <>{props.children}</>;
  }

  return <>{loading ? <AppLoader /> : props.children}</>;
};

const PersistGateWrapper = (props: PersistGateProps) => {
  if (typeof window === 'undefined') {
    return <>{props.children}</>;
  }

  return <PersistGate {...props} />;
};

function MyApp({ Component, pageProps }: AppProps) {
  const [configReady, setConfigReady] = useState(false);
  const { pathname } = useRouter();
  // `pathname` is the route pattern (e.g. /legal/[slug]), not the resolved URL,
  // so it is stable between server render and hydration.
  const marketing = isMarketingRoute(pathname);
  const marketingNeedingConfig = isMarketingApiRoute(pathname);

  useEffect(() => {
    if (config().apiUrl) {
      setConfigReady(true);
      return;
    }

    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        config.setEnv(data);
        setConfigReady(true);
      })
      .catch(() => {
        // still unblock the UI if config fails; callers that need apiUrl will no-op
        setConfigReady(true);
      });
  }, []);

  // land at the top of every new page (footer, nav, any link); animated unless
  // reduced motion is preferred. In-page anchor links (#…) keep their jump.
  useEffect(() => {
    const onRouteDone = (url: string) => {
      if (url.includes('#')) return;
      const reduce =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // run after the new page has laid out so the scroll actually takes
      requestAnimationFrame(() => {
        try {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: reduce ? 'auto' : 'smooth',
          });
        } catch (e) {
          window.scrollTo(0, 0);
        }
      });
    };
    Router.events.on('routeChangeComplete', onRouteDone);
    return () => Router.events.off('routeChangeComplete', onRouteDone);
  }, []);

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
            {marketing ? (
              // Render immediately. These pages are statically generated and
              // read nothing from the session.
              <Component {...pageProps} />
            ) : marketingNeedingConfig ? (
              // Config and interceptors only — no session lookup.
              configReady ? (
                <ApiInterceptors>
                  <Component {...pageProps} />
                </ApiInterceptors>
              ) : (
                <AppLoader />
              )
            ) : !configReady ? (
              <AppLoader />
            ) : (
              <AuthManager>
                <Component {...pageProps} />
              </AuthManager>
            )}
            {typeof window !== 'undefined' && (
              <ToastContainer hideProgressBar={true} autoClose={3000} />
            )}
          </NiceModal.Provider>
        </PersistGateWrapper>
      </Provider>
    </>
  );
}
export default MyApp;

import { useRouter } from 'next/router';
import { ComponentType, useEffect } from 'react';
import Cookies from 'js-cookie';
import { stringifyUrl } from 'query-string';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { loginSuccess } from 'pages/login/loginSlice';

function withAuth<T>(WrappedComponent: ComponentType<T>) {
  // eslint-disable-next-line react/display-name
  return (props: T) => {
    const { authenticated } = useAppSelector((state) => state.login);
    const dispatch = useAppDispatch();
    const authToken = Cookies.get('auth_token') as string;

    useEffect(() => {
      !authenticated && authToken && dispatch(loginSuccess);
    }, [authenticated, authToken, dispatch]);

    // checks whether we are on client / browser or server.
    if (typeof window !== 'undefined') {
      const Router = useRouter();

      // If there is no access token we redirect to "/" page.
      if (!authenticated) {
        const url = stringifyUrl({
          url: '/login',
          query: { goto: Router.pathname },
        });
        Router.replace(url);
        return null;
      }

      // If this is an accessToken we just render the component that was passed with all its props

      return <WrappedComponent {...props} />;
    }

    // If we are on server, return null
    return null;
  };
}

export default withAuth;

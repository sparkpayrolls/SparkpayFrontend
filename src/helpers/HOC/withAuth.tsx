import { useRouter } from 'next/router';
import { ComponentType } from 'react';
import { stringifyUrl } from 'query-string';
import { useAppSelector } from 'src/redux/hooks';

function withAuth<T>(WrappedComponent: ComponentType<T>) {
  // eslint-disable-next-line react/display-name
  return (props: T) => {
    // checks whether we are on client / browser or server.
    if (typeof window !== 'undefined') {
      const { user } = useAppSelector((state) => state);
      const Router = useRouter();
      const isLoggedIn = !!user;

      // If there is no access token we redirect to "/" page.
      if (!isLoggedIn) {
        const url = stringifyUrl({
          url: '/login',
          query: { goto: Router.pathname },
        });
        Router.replace(url);
        return null;
      }

      // if user email is not verified redirect to /check-inbox
      if (!user.emailVerified) {
        const url = stringifyUrl({
          url: '/check-inbox',
          query: { action: 'verify-email' },
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

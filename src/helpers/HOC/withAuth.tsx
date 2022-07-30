import { useRouter } from 'next/router';
import { ComponentType } from 'react';
import { stringifyUrl } from 'query-string';
import { useAppSelector } from 'src/redux/hooks';
import { Util } from '../util';
import { IAllowedPermissions } from '@/components/types';
import { Forbidden } from '@/components/Misc/not-found.component';

function withAuth<T>(
  WrappedComponent: ComponentType<T>,
  ...allowedPermissions: IAllowedPermissions
) {
  // eslint-disable-next-line react/display-name
  return (props: T) => {
    // checks whether we are on client / browser or server.
    if (typeof window !== 'undefined') {
      const { user, administrator } = useAppSelector((state) => state);
      const Router = useRouter();
      const isLoggedIn = !!user;

      // If there is no access token we redirect to "/" page.
      if (!isLoggedIn) {
        Util.redirectToLogin(Router);
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

      if (allowedPermissions.length) {
        if (!Util.canActivate(allowedPermissions, administrator)) {
          const availableRoute = Util.getAvailableRoute(administrator);
          if (availableRoute) {
            Router.replace(availableRoute);
            return null;
          }

          return <Forbidden />;
        }
      }
    }

    // Return component for SEO reasons
    return <WrappedComponent {...props} />;
  };
}

export default withAuth;

import { ComponentType } from 'react';
import { useAppSelector } from 'src/redux/hooks';
import { IAllowedPermissions } from '@/components/types';
import { Util } from '../util';

function withPermission<T>(
  WrappedComponent: ComponentType<T>,
  ...allowedPermissions: IAllowedPermissions
) {
  return function Wrapped(props: T) {
    const { user, administrator } = useAppSelector((state) => state);

    if (typeof window !== 'undefined') {
      const isLoggedIn = !!user;

      if (!isLoggedIn) {
        return null;
      }

      if (!Util.canActivate(allowedPermissions, administrator)) {
        return null;
      }

      return <WrappedComponent {...props} />;
    }

    return null;
  };
}

export default withPermission;

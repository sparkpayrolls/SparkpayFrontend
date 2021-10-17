import { Landing } from '@/components/Landing';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
// import withAuth from 'src/helpers/HOC/withAuth';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { commitUser } from 'src/redux/slices/user/user.slice';
// import { Button } from '../src/components/Button/Button';
import Dashboard from './dashboard';

// const Dashboard = withAuth(() => {
//   const dispatch = useAppDispatch();

//   const logout = () => {
//     Cookies.remove('auth_token');
//     dispatch(commitUser(null));
//   };

//   return (
//     <>
//       <h1>Dashboard</h1>
//       <Button label="Log out" onClick={logout} type="button" />
//     </>
//   );
// });

const Index = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state);
  const router = useRouter();
  const isLoggedIn = !!user;

  useEffect(() => {
    const { 'email-verification-code': code } = router.query;
    if (!user?.emailVerified && code) {
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
        });
    }
  }, [user, router, dispatch]);

  if (isLoggedIn) {
    return <Dashboard />;
  }

  return <Landing />;
};

export default Index;

// import withAuth from 'src/helpers/HOC/withAuth';
import { NextPage } from 'next';
import Head from 'next/head';
import DashboardLayout from 'src/layouts/dashboard-layout/DashboardLayout';
// import { toast } from 'react-toastify';

const Dashboard: NextPage = () => {
  // const notify = () => toast.warning('Wow so easy !', { delay: 1000 });
  return (
    <>
      <Head>
        <title>Log In</title>
      </Head>
      <DashboardLayout></DashboardLayout>
    </>
  );
};

// export default withAuth(Dashboard);
export default Dashboard;

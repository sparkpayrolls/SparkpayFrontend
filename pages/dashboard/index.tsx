// import withAuth from 'src/helpers/HOC/withAuth';
import { NextPage } from 'next';
import Head from 'next/head';
// import { toast } from 'react-toastify';
import DashBoardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';

const Dashboard: NextPage = () => {
  // const notify = () => toast.warning('Wow so easy !', { delay: 1000 });
  return (
    <>
      <Head>
        <title>Log In</title>
      </Head>
      <DashBoardLayout></DashBoardLayout>
    </>
  );
};

// export default withAuth(Dashboard);
export default Dashboard;

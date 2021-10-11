import withAuth from 'src/helpers/HOC/withAuth';
import { NextPage } from 'next';
import Head from 'next/head';
import { toast } from 'react-toastify';

const Dashboard: NextPage = () => {
  const notify = () => toast.warning('Wow so easy !', { delay: 1000 });
  return (
    <>
      <Head>
        <title>Log In</title>
      </Head>
      <main>
        <button onClick={notify}>Show Toast</button>
      </main>
    </>
  );
};

export default withAuth(Dashboard);

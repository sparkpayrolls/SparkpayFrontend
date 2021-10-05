import withAuth from 'src/helpers/HOC/withAuth';
import { NextPage } from 'next';
import Head from 'next/head';

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Log In</title>
      </Head>
      <main></main>
    </>
  );
};

export default withAuth(Dashboard);

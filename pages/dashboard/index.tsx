import withAuth from 'src/helpers/HOC/withAuth';
import { NextPage } from 'next';

const Dashboard: NextPage = () => {
  return <div></div>;
};

export default withAuth(Dashboard);

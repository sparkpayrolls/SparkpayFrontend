import { NextPage } from 'next';
import Head from 'next/head';
// import { toast } from 'react-toastify';

const EmployeeGroup: NextPage = () => {
  // const notify = () => toast.warning('Wow so easy !', { delay: 1000 });
  return (
    <>
      <Head>
        <title>First Tab</title>
      </Head>
      <div className="employee-section">
        <div className="employee-section__second-tab">
          <p>second Tab!! Hurray!!</p>
          {/* First tab content will go here */}
        </div>
      </div>
    </>
  );
};

export default EmployeeGroup;

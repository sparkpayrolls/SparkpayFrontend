import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Line } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';

import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import withAuth from 'src/helpers/HOC/withAuth';
import wallet_icon from '/public/svgs/frame-32466.svg';
import payroll_icon from '/public/svgs/frame-32468.svg';
import employee_icon from '/public/svgs/frame-32469.svg';
import organization_icon from '/public/svgs/frame-32465.svg';
import arrow_down from '/public/svgs/arrow-down.svg';
import wallet from '/public/images/wallet.png';
import credit_card from '/public/images/credit-card.png';
import cryptocurrency from '/public/images/cryptocurrency.png';
// import { toast } from 'react-toastify';

const lineData = {
  labels: ['1', '2', '3', '4', '5', '6'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      fill: true,
      backgroundColor: 'rgb(185 207 249 / 30%)',
      borderColor: 'rgb(37 99 235)',
    },
  ],
};

const lineOptions = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: { legend: { display: false } },
};

const doughnutData = {
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 10, 11],
      backgroundColor: [
        'rgba(103, 221, 228, 1)',
        'rgba(243, 163, 88, 1)',
        'rgba(255, 208, 77, 1)',
        'rgba(130, 115, 217, 1)',
      ],
    },
  ],
};

const Dashboard: NextPage = () => {
  // const notify = () => toast.warning('Wow so easy !', { delay: 1000 });
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <DashboardLayout>
        <div className="dashboard">
          <h2 className="dashboard__title">Dashboard</h2>

          <section className="dashboard__stats-section">
            <div className="stats">
              <div className="stats__summary">
                <span className="stats__number">5</span>
                <Image src={organization_icon} alt="organization icon" />
              </div>

              <span className="stats__info">Total number of Organisation</span>
            </div>

            <div className="stats">
              <div className="stats__summary">
                <span className="stats__number">₦125000000</span>
                <Image src={wallet_icon} alt="wallet icon" />
              </div>

              <span className="stats__info">Total payroll burden</span>
            </div>

            <div className="stats">
              <div className="stats__summary">
                <span className="stats__number">209</span>
                <Image src={payroll_icon} alt="payroll icon" />
              </div>

              <span className="stats__info">Total number of Payroll</span>
            </div>

            <div className="stats">
              <div className="stats__summary">
                <span className="stats__number">22</span>
                <Image src={employee_icon} alt="employee icon" />
              </div>

              <span className="stats__info">Total number of employees</span>
            </div>
          </section>

          <section className="dashboard__chart-section">
            <section className="disbursement">
              <div className="disbursement__header">
                <div className="disbursement__info">
                  <h3 className="disbursement__title">Disbursement trend</h3>
                  <span className="disbursement__date">
                    August 20, 2021, 12:41 PM
                  </span>
                </div>

                <button className="disbursement__select">
                  Monthly <Image src={arrow_down} alt="dropdown" />
                </button>
              </div>

              <Line data={lineData} options={lineOptions} />
            </section>

            <section className="payroll">
              <Doughnut data={doughnutData} options={{ cutout: '75%' }} />

              <div className="payroll__legend">
                <div className="payroll__legend-item">
                  <span className="payroll__legend-indicator">
                    <LegendColorSVG color="#67DDE4" /> Payroll 1
                  </span>
                  <span className="payroll__legend-value">₦ 3.1m</span>
                </div>

                <div className="payroll__legend-item">
                  <span className="payroll__legend-indicator">
                    <LegendColorSVG color="#FFD04D" /> Payroll 2
                  </span>
                  <span className="payroll__legend-value">₦ 3.1m</span>
                </div>

                <div className="payroll__legend-item">
                  <span className="payroll__legend-indicator">
                    <LegendColorSVG color="#8273D9" /> Payroll 3
                  </span>
                  <span className="payroll__legend-value">₦ 3.1m</span>
                </div>

                <div className="payroll__legend-item">
                  <span className="payroll__legend-indicator">
                    <LegendColorSVG color="#F3A358" /> Payroll 4
                  </span>
                  <span className="payroll__legend-value">₦ 3.1m</span>
                </div>
              </div>
            </section>
          </section>

          <section className="dashboard__transactions-section">
            <div className="transactions__header">
              <h3 className="transactions__title">Recent Transactions</h3>

              <Link href="#">
                <a className="transactions__link">View More</a>
              </Link>
            </div>

            <table className="table">
              <thead className="table__thead">
                <tr className="table__tr">
                  <th className="table__th">Transaction ID</th>
                  <th className="table__th">Amount</th>
                  <th className="table__th">Transaction Method</th>
                  <th className="table__th">Balance</th>
                  <th className="table__th">Status</th>
                  <th className="table__th">Date</th>
                </tr>
              </thead>
              <tbody className="table__tbody">
                <tr className="table__tr">
                  <td className="table__td">AA304059P</td>
                  <td className="table__td">₦ 41,200</td>
                  <td className="table__td table__td--method">
                    <Image src={wallet} alt="wallet icon" /> Wallet
                  </td>
                  <td className="table__td">₦ 41,200</td>
                  <td className="table__td status status--success">
                    <SuccessSvg />
                    Successful
                  </td>
                  <td className="table__td">
                    May 27, 2020 | <span className="date-time">12:38 PM</span>
                  </td>
                </tr>

                <tr className="table__tr">
                  <td className="table__td">AA304059P</td>
                  <td className="table__td">₦ 41,200</td>
                  <td className="table__td table__td--method">
                    <Image src={cryptocurrency} alt="cryptocurrency icon" />{' '}
                    Wallet
                  </td>
                  <td className="table__td">₦ 41,200</td>
                  <td className="table__td status status--failed">
                    <FailedSvg />
                    Failed
                  </td>
                  <td className="table__td">
                    May 27, 2020 | <span className="date-time">12:38 PM</span>
                  </td>
                </tr>

                <tr className="table__tr">
                  <td className="table__td">AA304059P</td>
                  <td className="table__td">₦ 41,200</td>
                  <td className="table__td table__td--method">
                    <Image src={credit_card} alt="credit-card icon" /> Wallet
                  </td>
                  <td className="table__td">₦ 41,200</td>
                  <td className="table__td status status--success">
                    <SuccessSvg />
                    Successful
                  </td>
                  <td className="table__td">
                    May 27, 2020 | <span className="date-time">12:38 PM</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="transactions__mobile-view">
              <div className="transactions__summary">
                <div>
                  <span>AA304059P</span> <span>₦ 120,000</span>
                </div>

                <div>
                  <span className="date-time">May 27, 2020 | 12:38 PM</span>

                  <span className="status status--success">
                    <SuccessSvg />
                    Successful
                  </span>
                </div>
              </div>

              <div className="transactions__summary">
                <div>
                  <span>AA304059P</span> <span>₦ 120,000</span>
                </div>

                <div>
                  <span className="date-time">May 27, 2020 | 12:38 PM</span>

                  <span className="status status--failed">
                    <FailedSvg />
                    Failed
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </DashboardLayout>
    </>
  );
};

export default withAuth(Dashboard);
// export default Dashboard;

const SuccessSvg = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="6" cy="6" r="6" fill="#EAFBF1" />
    <circle cx="6" cy="6" r="3" fill="#27BE63" />
  </svg>
);

const FailedSvg = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="6" cy="6" r="6" fill="#FCE9E9" />
    <circle cx="6" cy="6" r="3" fill="#CA1B1B" />
  </svg>
);

const LegendColorSVG = ({ color }: { color: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="16" height="16" rx="4" fill={color} />
  </svg>
);

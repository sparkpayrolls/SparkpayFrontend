// import { NextPage } from 'next';
// import Link from 'next/link';
// import { Company, Country } from 'src/api/types';
// import withAuth from 'src/helpers/HOC/withAuth';
// import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
// import { useAppSelector } from 'src/redux/hooks';

// export const RemittancesDetails = ({
//   title,
//   details,
//   url,
// }: {
//   title: string;
//   details: string;
//   url: string;
// }) => {
//   return (
//     <Link href={url}>
//       <a className="remittances-page__remittances_details-section remittances__card">
//         <span className="remittances-page__remittances_details-title">
//           {title}
//         </span>
//         <span className="remittances-page__remittances_details">{details}</span>
//       </a>
//     </Link>
//   );
// };

// const regions: Record<
//   string,
//   { title: string; description: string; url: string }[]
// > = {
//   nigeria: [
//     {
//       title: 'Tax',
//       description:
//         'Remit taxes to the appropriate tax offices and tax states for all your employees with ease.',
//       url: '/remittances/nigeria/taxes',
//     },
//   ],
// };

// const Remittances: NextPage = () => {
//   const administrator = useAppSelector((state) => state.administrator);
//   const company = administrator?.company as Company;
//   const country = company?.country as Country;
//   const countryName = country?.name;
//   const remittances = regions[countryName?.toLowerCase()];

//   return (
//     <DashboardLayout pageTitle="Remittances">
//       <div className="remittances-page">
//         <h1 className="remittances-page__remittances-header-title">
//           Remittance
//         </h1>
//         {!remittances || !remittances.length ? (
//           <div className="remittances-page__empty-container">
//             <p className="remittances-page__empty-text">
//               We currently don&apos;t support any remittances in your region
//               yet. Stay tuned.
//             </p>
//           </div>
//         ) : (
//           <>
//             <p className="remittances-page__remittances-title-paragraph">
//               {remittances?.length} Remittance(s)
//             </p>
//             <div></div>
//             <div
//               className="remittances-page__remittances-cards
//     "
//             >
//               {remittances?.map((remittance) => {
//                 return (
//                   <RemittancesDetails
//                     key={remittance.title}
//                     title={remittance.title}
//                     details={remittance.description}
//                     url={remittance.url}
//                   />
//                 );
//               })}
//             </div>
//           </>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default withAuth(Remittances, ['Remittance', 'read']);

export default function Decomissioned() {
  return null;
}

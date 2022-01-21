import { NextPage } from 'next';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';



export const RemittancesDetails = ({
  title,
  details,
}: {
  title: string;
  details: string;
}) => {
  return (
    <div className="remittances-page__remittances_details-section remittances__card">
      <div>
        <p className="remittances-page__remittances_details-title">{title}</p>
        <p className="remittances-page__remittances_details">{details}</p>
      </div>
    </div>
  );
}

const Remittances: NextPage = () => {
  return (
    <DashboardLayout pageTitle="remittances">
      <div className="remittances-page">
        <h1 className="remittances-page__remittances-header-title">
          Remittance
        </h1>
        <p className="remittances-page__remittances-title-paragraph">3 remittances</p>
        <div>
        </div>
        <div
          className="remittances-page__remittances-cards
    "
        >
          <RemittancesDetails
            title="Tax"
            details="Lorem sunt eiusmod officia incid excepteur 
            aliquip cillum aute mollit aliqua dolor."
          />
          
          <RemittancesDetails
            title="Pension"
            details="Lorem sunt eiusmod officia incid excepteur 
            aliquip cillum aute mollit aliqua dolor."
          />
          <RemittancesDetails
            title="NHF"
            details="Lorem sunt eiusmod officia incid excepteur
             aliquip cillum aute mollit aliqua dolor."
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Remittances;

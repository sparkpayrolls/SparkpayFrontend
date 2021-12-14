import { ReactNode } from 'react';
import Skeleton from 'react-loading-skeleton';

import 'react-loading-skeleton/dist/skeleton.css';

export const SinglePayrollDetail = ({
  title,
  details,
  loading,
}: {
  title: ReactNode;
  details: ReactNode;
  loading?: boolean;
}) => {
  return (
    <div className="payroll-details-section__single-details">
      <div>
        <p className="employee-details__employee-details-text">{title}</p>
        <p className="employee-details__employee-details-text-one">
          {loading && <Skeleton width={100} borderRadius={4} count={1} />}
          {!loading && details}
        </p>
      </div>
    </div>
  );
};

import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';

export const NotFound = (props: { message: string }) => {
  return (
    <div className="not-found">
      <div className="not-found__content">
        <div className="deco-404">
          <h3 className="deco-404__text">Oops! not found</h3>
          <h1 className="deco-404__deco">
            <span>4</span>
            <span>0</span>
            <span>4</span>
          </h1>
        </div>
        <h2 className="not-found__content__message">{props.message}</h2>
      </div>
    </div>
  );
};

export const Forbidden = (props: { message?: string }) => {
  return (
    <DashboardLayout pageTitle="Forbidden">
      <div className="not-found forbidden">
        <div className="not-found__content">
          <div className="deco-404">
            <h3 className="deco-404__text">Forbidden!</h3>
            <h1 className="deco-404__deco">
              <span>4</span>
              <span>0</span>
              <span>3</span>
            </h1>
          </div>
          <h2 className="not-found__content__message">
            {props.message || 'You do not have permission to view this page'}
          </h2>
        </div>
      </div>
    </DashboardLayout>
  );
};

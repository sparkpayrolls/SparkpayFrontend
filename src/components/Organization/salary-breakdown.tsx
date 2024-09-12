import React, { useState } from 'react';
import { ChevronBack, EditPenSvg, IllustrationSvg, Info } from '../svg';
import { useOrganizationDetails } from 'src/helpers/hooks/use-org-details';
import { Breakdown } from './org-comp';
import Skeleton from 'react-loading-skeleton';

type Props = {
  organizationDetails: ReturnType<typeof useOrganizationDetails>;
};

function SalaryBreakdown(props: Props) {
  const [breakdown, setBreakdown] = useState<boolean>(false);
  const [hint, setHint] = useState<boolean>(false);
  const { organization, loading, canEdit } = props.organizationDetails;
  const [edit, setEdit] = useState<boolean>(false);

  return loading ? (
    <div className="info__right-cont">
      <div className="info__right-cont__flex">
        <div className="info__right-cont__flex-text">
          <span className="info__right-cont__back-icon">
            <Skeleton height={40} width={100} />{' '}
          </span>
        </div>
      </div>
      <form className="info__right-cont__breakdown">
        <div className="info__right-cont__breakdown__wrapper">
          <div className="info__right-cont__breakdown__box">
            <Skeleton height={40} />
            <Skeleton height={40} />
            <Skeleton height={40} />
            <Skeleton height={40} />
          </div>
          <div className="info__right-cont__breakdown__action">
            <Skeleton height={40} width={175} />
            <Skeleton height={40} width={175} />
          </div>
        </div>
      </form>
    </div>
  ) : (
    <div className="info__right-cont">
      {edit ? (
        <>
          {organization?.salaryBreakdown ? (
            <>
              <div className="info__right-cont__flex">
                <div className="info__right-cont__flex-text">
                  <span
                    className="info__right-cont__back-icon"
                    onClick={() => setEdit(!edit)}
                  >
                    <ChevronBack />
                  </span>
                </div>
              </div>
              <form
                className="info__right-cont__breakdown"
                onSubmit={(e) => e.preventDefault()}
              >
                {' '}
                <div className="info__right-cont__breakdown__wrapper">
                  {organization?.salaryBreakdown?.map((breakdown, i) => (
                    <Breakdown
                      value={breakdown.value}
                      name={breakdown.name}
                      key={i}
                    />
                  ))}
                </div>
                <div className="info__right-cont__breakdown__action">
                  <button className="info__right-cont__breakdown__action__add">
                    Add
                  </button>
                  <button className="info__right-cont__breakdown__action__save">
                    Save
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="info__right-cont__flex">
                <span className="info__right-cont__flex-text">
                  <p className="info__right-cont__hero-text">
                    Salary Breakdown
                  </p>
                  <span
                    onMouseEnter={() => {
                      setHint(true);
                    }}
                    onMouseLeave={() => setHint(false)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Info />
                  </span>
                </span>

                {canEdit && (
                  <button
                    onClick={() => setBreakdown(!breakdown)}
                    className="info__breakdown-button"
                  >
                    Set Breakdown
                  </button>
                )}
              </div>
              <div className={`info__right-cont__banner ${hint ? 'show' : ''}`}>
                <p>
                  A salary breakdown is the detailed list of how an employee’s
                  salary is divided into various components such as base pay,
                  bonuses, benefits, and taxes.
                </p>
              </div>
              <div className="info__right-cont__cont">
                <div>
                  <p>No salary breakdown yet. Set your salary breakdown.</p>
                  <IllustrationSvg />
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="info__right-cont__flex">
            <span className="info__right-cont__flex-text">
              <p className="info__right-cont__hero-text">Salary Breakdown</p>
              <span
                onMouseEnter={() => {
                  setHint(true);
                }}
                onMouseLeave={() => setHint(false)}
                style={{ cursor: 'pointer' }}
              >
                <Info />
              </span>
            </span>

            {canEdit && (
              <button
                onClick={() => setEdit(!edit)}
                className="info__breakdown-button"
              >
                Edit
                <EditPenSvg />
              </button>
            )}
          </div>
          <div className={`info__right-cont__banner ${hint ? 'show' : ''}`}>
            <p>
              A salary breakdown is the detailed list of how an employee’s
              salary is divided into various components such as base pay,
              bonuses, benefits, and taxes.
            </p>
          </div>
          <div className="info__right-cont__cont">
            <div>
              <p>No salary breakdown yet. Set your salary breakdown.</p>
              <IllustrationSvg />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SalaryBreakdown;

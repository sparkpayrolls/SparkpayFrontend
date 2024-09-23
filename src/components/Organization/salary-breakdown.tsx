import React, { PropsWithChildren } from 'react';
import { ChevronBack, EditPenSvg, IllustrationSvg, InfoSVG } from '../svg';
import { Breakdown } from './org-comp';
import Skeleton from 'react-loading-skeleton';
import { IF } from '../Misc/if.component';
import { OrganizationDashboardPieChart } from '../Chart/organizationdashoard-chart';
import { Button } from '../Button/Button.component';
import { RemittanceTabProps } from './types';
import { useSalaryBreakdownContext } from './organization-hooks';
import { Alert, Popover } from 'antd';

export const InfoPopUp = (props: PropsWithChildren<unknown>) => {
  return (
    <>
      <Popover placement="bottom" trigger="hover" content={props.children}>
        <span>
          <InfoSVG />
        </span>
      </Popover>
    </>
  );
};

const PopUp = () => (
  <InfoPopUp>
    <p className="info__right-cont__banner">
      A salary breakdown is the detailed list of how an employee&apos;s salary
      is divided into various components such as base pay, bonuses, benefits,
      and taxes.
    </p>
  </InfoPopUp>
);

const BreakdownItem = (props: {
  value: number;
  name: string;
  color: string;
}) => {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      <div>
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: props.color,
          }}
        ></div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '4px 8px',
        }}
      >
        <p
          style={{
            fontWeight: 500,
            fontSize: '1rem',
            lineHeight: '1rem',
            color: '#0B2253',
          }}
        >
          {props.name}
        </p>

        <p
          style={{
            fontWeight: 400,
            fontSize: '.875rem',
            lineHeight: '1rem',
            color: '#6D7A98',
          }}
        >
          {props.value}%
        </p>
      </div>
    </div>
  );
};

function SalaryBreakdown(props: RemittanceTabProps) {
  const {
    _breakdown,
    backgroundColors,
    chartLabels,
    chartValues,
    organization,
    breakdown,
    loading,
    canEdit,
    saving,
    edit,
    setEdit,
    canSave,
    addBreakdown,
    handleBreakdown,
    handleBreakdownDelete,
    savBreakdown,
  } = useSalaryBreakdownContext(props);

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
          <div className="info__right-cont__breakdown">
            {' '}
            <div className="info__right-cont__breakdown__wrapper">
              <IF condition={!canSave}>
                <Alert
                  type="error"
                  message={'Total breakdown should sum up to 100%'}
                />
              </IF>
              {breakdown.map((_breakdown, i) => (
                <Breakdown
                  value={_breakdown.value}
                  name={_breakdown.name}
                  handler={handleBreakdown(i)}
                  onDelete={handleBreakdownDelete(i)}
                  key={i}
                />
              ))}
            </div>
            <div className="info__right-cont__breakdown__action">
              <Button
                onClick={addBreakdown}
                className="info__right-cont__breakdown__action__add"
              >
                Add
              </Button>

              <Button
                disabled={!canSave || saving}
                className="info__right-cont__breakdown__action__save"
                showSpinner={saving}
                onClick={savBreakdown}
              >
                Save
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="info__right-cont__flex">
            <span className="info__right-cont__flex-text">
              <p className="info__hero-text ">Salary Breakdown</p>
              <PopUp />
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

          <IF condition={!organization?.salaryBreakdown?.length}>
            <div className="info__right-cont__cont">
              <div>
                <p>No salary breakdown yet. Set your salary breakdown.</p>
                <IllustrationSvg />
              </div>
            </div>
          </IF>

          <IF condition={organization?.salaryBreakdown?.length}>
            <div
              style={{
                maxHeight: '200px',
                marginInline: 'auto',
                marginBlock: '45px',
              }}
            >
              <OrganizationDashboardPieChart
                labels={chartLabels}
                currency=""
                innerRadius={0.85}
                datasets={[
                  { data: chartValues, backgroundColor: backgroundColors },
                ]}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                maxWidth: '390px',
                marginInline: 'auto',
              }}
            >
              {_breakdown.map((breakdown, i) => {
                return (
                  <BreakdownItem
                    name={breakdown.name}
                    value={breakdown.value}
                    key={i}
                    color={backgroundColors[i]}
                  />
                );
              })}
            </div>
          </IF>
        </>
      )}
    </div>
  );
}

export default SalaryBreakdown;

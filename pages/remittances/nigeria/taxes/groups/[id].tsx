import { Button } from '@/components/Button/Button.component';
import { SingleDetail } from '@/components/Employee/single-detail.component';
import { GroupEmployees } from '@/components/Group/group-employees.component';
import { NotFound } from '@/components//Misc/not-found.component';
import { TaxGroupModal } from '@/components/Modals/TaxGroupModal.component';
import NiceModal from '@ebay/nice-modal-react';
import { useCallback, useEffect, useState } from 'react';
import { Group, NigerianTaxGroupMeta, State } from 'src/api/types';
import { Util } from 'src/helpers/util';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import { useAppSelector } from 'src/redux/hooks';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { useRouter } from 'next/router';

const EmployeeTaxGroupPage = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState<
    Group<NigerianTaxGroupMeta> | 'not found'
  >();
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);

  const getGroup = useCallback(async () => {
    if (!router.isReady) {
      return;
    }
    try {
      setLoading(true);
      const group = await $api.remittance.nigeria.tax.getTaxGroup(
        router.query.id as string,
      );

      setGroup(group);
    } catch (error) {
      Util.onNonAuthError(error, (httpError) => {
        if (httpError.status === 404) {
          setGroup('not found');
          return;
        }
        toast.error(httpError.message);
      });
    } finally {
      setLoading(false);
    }
  }, [router]);

  const addEmployee = async (id: string) => {
    if (group && group !== 'not found') {
      await $api.remittance.nigeria.tax.addEmployeesToTaxGroup(group.id, [id]);
    }
  };

  const removeEmployee = async (id: string) => {
    if (group && group !== 'not found') {
      await $api.remittance.nigeria.tax.removeEmployeesFromTaxGroup(group.id, [
        id,
      ]);
    }
  };

  useEffect(() => {
    getGroup();
  }, [getGroup, administrator]);

  if (!router.isReady) {
    return null;
  }

  return (
    <DashboardLayoutV2
      title="Tax Group"
      href="/remittances/nigeria/taxes?tab=groups#"
    >
      <div className="tax-group-details">
        <div className="tax-group-details__header">
          <h5 className="tax-group-details__page-title">Group Details</h5>

          {group !== 'not found' && (
            <Button
              className="tax-group-details__edit-button"
              type="button"
              label="Edit details"
              showSpinner={loading}
              disabled={loading || !group}
              onClick={() => {
                if (group) {
                  NiceModal.show(TaxGroupModal, {
                    id: group.id,
                    initialValues: group,
                  }).then(getGroup);
                }
              }}
              primary
            />
          )}
        </div>
        {group === 'not found' && (
          <div className="tax-group-details__not-found">
            <NotFound message="Group not found" />
          </div>
        )}
        {group !== 'not found' && (
          <div className="tax-group-details__container">
            <div className="tax-group-details__section">
              <div>
                <SingleDetail
                  title="Name"
                  details={group?.name}
                  loading={loading}
                />
              </div>
              <div>
                <SingleDetail
                  title="Status"
                  details={group?.meta?.status || '——'}
                  loading={loading}
                />
              </div>
              <div>
                <SingleDetail
                  title="Tax Id"
                  details={group?.meta?.taxId || '——'}
                  loading={loading}
                />
              </div>
            </div>

            <div className="tax-group-details__section">
              <div>
                <SingleDetail
                  title="Tax State"
                  details={
                    ((group?.meta?.taxState as unknown) as State)?.name || '——'
                  }
                  loading={loading}
                />
              </div>
              <div>
                <SingleDetail
                  title="Tax Office"
                  details={group?.meta?.taxOffice || '——'}
                  loading={loading}
                />
              </div>
              <div>
                <SingleDetail
                  title="Type"
                  loading={loading}
                  details={group?.meta?.type || '——'}
                />
              </div>
            </div>

            <div className="tax-group-details__section">
              {group?.meta?.type === 'WITHHOLDING' && (
                <div>
                  <SingleDetail
                    title="Withholding Tax Rate"
                    details={(group?.meta?.whTaxRate || 0) * 100}
                    loading={loading}
                  />
                </div>
              )}
              <div>
                <SingleDetail
                  title="Description"
                  details={group?.description}
                  loading={loading}
                />
              </div>
            </div>

            {group?.meta?.salaryBreakdown && (
              <div
                className="tax-group-details__section"
                style={{ justifyContent: 'flex-start' }}
              >
                <h5 className="tax-group-details__section-title">
                  Salary Breakdown
                </h5>
                {group?.meta?.salaryBreakdown?.map((breakdown) => {
                  return (
                    <div key={breakdown.name}>
                      <SingleDetail
                        title={breakdown.name}
                        details={`${breakdown.value}%`}
                        loading={loading}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {group?.meta?.customTaxRelief && (
              <div
                className="tax-group-details__section"
                style={{ justifyContent: 'flex-start' }}
              >
                <h5 className="tax-group-details__section-title">
                  Custom Tax Relief Items
                </h5>
                {group?.meta?.customTaxRelief?.map((relief) => {
                  return (
                    <div key={relief.name}>
                      <SingleDetail
                        title={relief.name}
                        details={`${currency} ${Util.formatMoneyNumber(
                          relief.amount,
                        )}`}
                        loading={loading}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            <div className="tax-group-details__section">
              <div className="tax-group-details__employees">
                <GroupEmployees
                  groupId={router.query.id as string}
                  addEmployee={addEmployee}
                  removeEmployee={removeEmployee}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayoutV2>
  );
};

export default EmployeeTaxGroupPage;

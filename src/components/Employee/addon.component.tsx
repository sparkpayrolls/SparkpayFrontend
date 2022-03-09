import { useRouter } from 'next/router';
import NiceModal from '@ebay/nice-modal-react';
import { useCallback, useEffect, useState } from 'react';
import { CreateAddonModal } from '../Modals/CreateAddonModal.component';
import { TableLayout } from '../Table/table-layout.component';
import { TableV2 } from '../Table/Table.component';
import { StatusChip } from '../StatusChip/status-chip.component';
import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { KebabMenu } from '../KebabMenu/KebabMenu.component';
import { Util } from 'src/helpers/util';
import moment from 'moment';
import { Pagination } from '../Pagination/pagination.component';
import { TableEmptyState } from '../EmptyState/table-emptystate.component';
import { PaginationMeta, SalaryAddOn, SalaryAddOnStatus } from 'src/api/types';
import useApiCall from 'src/helpers/hooks/useapicall.hook';
import { toast } from 'react-toastify';
import { HttpError } from 'src/api/repo/http.error';
import { $api } from 'src/api';
import { useAppSelector } from 'src/redux/hooks';
import { confirmation } from '../Modals/ConfirmationModal.component';

interface IAddon {
  editHandler?: {
    edit: boolean;
    // eslint-disable-next-line no-unused-vars
    setEdit(edit: boolean): any;
  };
}

export const Addon = (props: IAddon) => {
  const { editHandler } = props;
  const router = useRouter();
  const entity = router.query.id as string;
  const administrator = useAppSelector((state) => state.administrator);
  const [addons, setAddons] = useState<SalaryAddOn[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const [params, setParams] = useState<Record<string, any>>({});
  const [loading, startLoading, endLoading] = useApiCall();

  const getAddons = useCallback(async () => {
    try {
      startLoading();
      const { data, meta } = await $api.employee.getSalaryAddons(
        entity,
        params,
      );
      setAddons(data);
      setMeta(meta);
    } catch (error) {
      const httpError = error as HttpError;
      toast.error(httpError.message);
    } finally {
      endLoading();
    }
  }, [endLoading, entity, params, startLoading]);

  useEffect(() => {
    if (editHandler) {
      const { edit, setEdit } = editHandler;
      if (edit) {
        setEdit(false);
        (NiceModal.show(CreateAddonModal, {
          entity,
        }) as Promise<SalaryAddOn>).then((addon: SalaryAddOn) => {
          setAddons((addons) => [addon, ...addons]);
          getAddons();
        });
      }
    }
  }, [editHandler, entity, getAddons]);

  useEffect(() => {
    getAddons();
  }, [getAddons, administrator]);

  const onEdit = (addon: SalaryAddOn) => {
    return () => {
      (NiceModal.show(CreateAddonModal, {
        id: addon.id,
        entity,
        initialValues: addon,
      }) as Promise<SalaryAddOn>).then((addon: SalaryAddOn) => {
        setAddons(
          addons.map((a) => {
            if (a.id === addon.id) {
              return addon;
            }
            return a;
          }),
        );
        getAddons();
      });
    };
  };
  const toggleStatus = (id: string, status: SalaryAddOnStatus) => {
    return async () => {
      try {
        startLoading();
        await $api.employee.updateSalaryAddon(id, { status });
        setAddons(
          addons.map((addon) => {
            if (addon.id === id) {
              addon.status = status;
            }
            return addon;
          }),
        );
        getAddons();
        toast.success('Addon status updated succesfully');
      } catch (error) {
        const httpError = error as HttpError;
        toast.error(httpError.message);
      } finally {
        endLoading();
      }
    };
  };
  const deleteAddon = (id: string) => {
    return async () => {
      const shouldDelete = await confirmation({
        title: 'Delete Addon',
        text: 'Are you sure you want to permanently delete this Addon?',
      });
      if (!shouldDelete) {
        return;
      }
      try {
        startLoading();
        await $api.employee.deleteSalaryAddon(id);
        setAddons(addons.filter((a) => a.id !== id));
        getAddons();
        toast.success('Addon deleted successfully');
      } catch (error) {
        const httpError = error as HttpError;
        toast.error(httpError.message);
      } finally {
        endLoading();
      }
    };
  };

  const currency = Util.getCurrencySymbolFromAdministrator(administrator);

  return (
    <div className="addon">
      <TableLayout
        title={`${meta?.total || 0} Addon${
          (meta?.total as any) === 1 ? '' : 's'
        }`}
        onSearch={(search) => setParams({ ...params, search })}
        searchPlaceholder="Search by name"
      >
        <TableV2 loading={loading}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Payroll Cycle</th>
              <th>Frequency</th>
              <th>Next Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {addons.map((addon) => {
              const date = Util.getNextAddonDate(addon, moment);
              const addonActive = addon.status === 'active';
              const kebabItems = [
                { value: 'Edit', action: onEdit(addon) },
                {
                  value: addonActive ? 'Disable' : 'Enable',
                  action: toggleStatus(
                    addon.id,
                    addonActive ? 'disabled' : 'active',
                  ),
                },
                { value: 'Delete', action: deleteAddon(addon.id) },
              ];

              return (
                <tr key={addon.id}>
                  <td className="white-space-nowrap">{addon.name}</td>
                  <td>{addon.type}</td>
                  <td>
                    <div className="addon__description">
                      {addon.description}
                    </div>
                  </td>
                  <td className="white-space-nowrap">
                    {addon.type === 'prorate' ? (
                      <>N/A</>
                    ) : (
                      <>
                        {currency} {Util.formatMoneyNumber(addon.amount)}
                      </>
                    )}
                  </td>
                  <td>{addon.payrollCycle}</td>
                  <td>{addon.frequency}</td>
                  <td>
                    {Array.isArray(date) ? (
                      <DateTimeChip.Range
                        date={date}
                        dateFormat="MMM DD, YYYY"
                      />
                    ) : (
                      <DateTimeChip date={date} dateFormat="MMM, YYYY" />
                    )}
                  </td>
                  <td>
                    <span className="d-flex align-items-center">
                      <StatusChip status={addon.status as SalaryAddOnStatus} />
                      <KebabMenu items={kebabItems} />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </TableV2>
      </TableLayout>
      {!addons.length && (
        <TableEmptyState
          text={loading ? 'Getting addons' : 'Addons will appear here'}
        />
      )}
      <Pagination meta={meta} refresh={setParams} />
    </div>
  );
};

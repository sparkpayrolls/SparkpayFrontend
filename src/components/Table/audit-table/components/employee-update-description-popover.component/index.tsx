import { merge } from 'lodash';
import { Util } from 'src/helpers/util';
import { DescriptionPopoverComponent } from '../../types';

const ChangeItem = (props: {
  changeKey: string;
  change: Record<string, unknown>;
}) => {
  const { change } = props;
  const { from, to } = change;
  let { changeKey } = props;
  if (changeKey.includes('.')) {
    const keys = changeKey.split('.');
    changeKey = keys[keys.length - 1];
  }

  return (
    <tr>
      <td>{Util.camelCaseToTitleCase(changeKey)}</td>
      <td>{from as string}</td>
      <td>{to as string}</td>
    </tr>
  );
};

export const EmployeeUpdateDescriptionPopOver: DescriptionPopoverComponent = (
  props,
) => {
  const { meta } = props;
  const employee = merge({}, meta?.record);
  const update = merge({}, meta?.record, meta?.update);
  const changes = Util.getChanges(employee, update);

  return (
    <div className="employee-update-description-popover">
      <table>
        <thead>
          <tr>
            <th>Changed</th>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(changes).map(([key, change]) => {
            return <ChangeItem key={key} changeKey={key} change={change} />;
          })}
        </tbody>
      </table>
    </div>
  );
};

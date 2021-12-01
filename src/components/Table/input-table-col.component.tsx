import { EditSVG } from '../svg';

export const InputTableColumn = () => {
  return (
    <span className="input-table-column">
      <span className="input-table-column__icon">
        <EditSVG />{' '}
      </span>

      <input type="text" className="input-table-column__input" />
    </span>
  );
};

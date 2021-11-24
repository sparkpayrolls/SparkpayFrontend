import { FileStorageSVG } from '../svg';

export const TableEmptyState = ({ text }: { text?: string }) => {
  return (
    <div className="table-empty-state">
      <FileStorageSVG />
      <span className="table-empty-state__text">{text ?? 'No data'}</span>
    </div>
  );
};

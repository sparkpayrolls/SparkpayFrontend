import { PlusSvg } from '../svg';
import { Button } from './Button.component';

export const CreateAuditTrailButton = () => {
  return (
    <Button
      label={
        <>
          {'Export'}
          <PlusSvg />
        </>
      }
      className="employee-section__submit-btn"
      primary
      type="submit"
    />
  );
};

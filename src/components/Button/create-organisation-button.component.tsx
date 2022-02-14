import NiceModal from '@ebay/nice-modal-react';
import { useAppDispatch } from 'src/redux/hooks';
import { refreshCompanies } from 'src/redux/slices/companies/companies.slice';
import { CreateOrgnizationModal } from '../Modals/CreateOrganizationModal.component';
import { PlusSvg } from '../svg';
import { ICreateOrganisationButton } from '../types';
import { Button } from './Button.component';

export const CreateOrganisationButton = (props: ICreateOrganisationButton) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    NiceModal.show(CreateOrgnizationModal).then((org: any) => {
      refreshCompanies(dispatch);
      if (props.onCreate) {
        props.onCreate(org);
      }
    });
  };

  return (
    <Button
      label={
        <>
          <PlusSvg /> {'Create Organisation'}
        </>
      }
      onClick={handleClick}
      className="employee-section__submit-btn"
      primary
      type="submit"
    />
  );
};

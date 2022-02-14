import NiceModal from '@ebay/nice-modal-react';
import { useAppDispatch } from 'src/redux/hooks';
import { refreshCompanies } from 'src/redux/slices/companies/companies.slice';
import { CreateOrgnizationModal } from '../Modals/CreateOrganizationModal.component';
import { PlusSvg } from '../svg';
import { ICreateOrganisationButton } from '../types';
import { Button } from './Button.component';
import { MoreMenuHorizontalSVG, Plus2Svg } from '@/components/svg';
import { Dropdown, Menu } from 'antd';

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

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <button className="employee-menu-list" onClick={handleClick}>
          <Plus2Svg /> Create Organisation
        </button>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
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
      <Dropdown
        overlay={menu}
        trigger={['click']}
        overlayClassName="employee-dropdown"
      >
        <button className="employee-section__employee-menu">
          <MoreMenuHorizontalSVG />
        </button>
      </Dropdown>
    </>
  );
};

import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import { Button } from '../../src/components/Button/Button.component';
import Image from 'next/image';
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
} from 'react';
import { EditableSVG, } from '../../src/components/svg/index';
import { InputError } from '@/components/Shared/input-error.component';
import classNames from 'classnames';
import SelectTaxImage from "../../public/svgs/select.svg";
import backicon from '../../public/svgs/back-icon.svg';
import Link from 'next/link';
import EmployeeSearchIcon from "../../public/svgs/search-icon.svg"
import { DeleteTaxSVG } from './../../src/components/svg/index';
import { TableV2 } from '@/components/Table/Table.component';
import { TableLayout } from '@/components/Table/table-layout.component';
import { CheckboxTableColumn } from '@/components/Table/check-box-table-col.component';


const EmployeeTaxList = () => {
  return (

    <DashboardLayout pageTitle="remittances-tax">
      <div className="remit-page">
        <div className="remittances-tax-section">
          <div className="group-details__header-content">
            <div className="group-details__group-detail-title-section">
              <Link href="/remittances">
                <a>
                  <Image
                    src={backicon}
                    alt="group-details-image"
                    className="group-details__prev-icon"
                  />
                </a>
              </Link>
              <h5 className="group-details__group-detail-title">Tax Group Name</h5>
            </div>
            <Button
              label={<>{'Save'}</>}
              element="a"
              className="payroll-section__submit-btn"
              primary
              type="submit"
            />
          </div>
          <div className="remittances-tax-page__tax-details-table">
          <h1 className="remittances-tax-page__search-text">Search</h1>
            <div className="remittances-tax-page__employee-tax-flex">
              <input type="text"
                placeholder='Search by employee name or email'
                className="remittances-tax-page__employee-input"
              />
              <div className="remittances-tax-page__employee-image"
              >
                <Image
                  src={EmployeeSearchIcon}
                  alt="group-details-image" />
              </div>
            </div>
            <div className="remittances-tax-page__tax-table">
              <h1>Employees on Tax list</h1>
             <TableLayout>
               <TableV2>
                  <thead>
                    <tr>
                      <CheckboxTableColumn
                        element="th"
                      >
                        Name
                      </CheckboxTableColumn>
                      <th>Phone Number</th>
                      <th>Payee ID </th>
                      <th>Tax State</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                     <tr>
                        <CheckboxTableColumn
                        element="td"
                      >
                        Esther Howard
                      </CheckboxTableColumn>
                    <td>
                      <EditableField
                          placeholder="Phone Number"
                      />
                    </td>
                    <td>
                      <EditableField
                        placeholder="Payee ID"
                      />
                    </td>
                      <td>
                        <SelectEditableField
                          placeholder="Selete state"
                        />
                      </td>
                      <span className="remittances-tax-page__tax-trash-delete">
                        <td>
                          <Button
                            label={
                              <>
                                <DeleteTaxSVG />
                                &nbsp;{'Delete'}
                              </>
                            }
                            danger
                            size="small"
                            type="button"

                          />
                        </td>
                      </span>
                     </tr>
                  </tbody>
               </TableV2>
             </TableLayout>
            </div>
          </div>
        </div>
      </div>

    </DashboardLayout>
  );
};








const EditableField = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & { error?: boolean | string },
) => {
  const inputClassname = classNames('employee-list__input-container__input', {
    'employee-list__input-container__input--has-error': !!props.error,
  });

  return (
    <div className="employee-list__input-container">
      <input {...props} className={inputClassname} />
      <span>
        <EditableSVG />
      </span>
      <div className="employee-list__input-container__error">
        <InputError>{props.error}</InputError>
      </div>
    </div>
  );
};



const SelectEditableField = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & { error?: boolean | string },
) => {
  const inputClassname = classNames('employee-list__input-container__input', {
    'employee-list__input-container__input--has-error': !!props.error,
  });

  return (
    <div className="employee-list__input-container">
      <input {...props} className={inputClassname} />
      <span>
        <Image src={SelectTaxImage} alt="employee-list__image"/>
      </span>
      <div className="employee-list__input-container__error">
        <InputError>{props.error}</InputError>
      </div>
    </div>
  );
};


export default EmployeeTaxList;
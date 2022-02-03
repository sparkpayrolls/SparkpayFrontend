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
import { DeleteTaxSVG } from './../../src/components/svg/index';
import { Table, TR } from '../../src/components/Table/Table.component';

const EmployeeTaxList = () => {
  return (

    <DashboardLayout pageTitle="remittances-tax">
      <div className="remittances-tax-page">
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
          <h1>Search</h1>
            <div className="remittances-tax-page__tax-table">
              <Table
                headerRow={[
                  'Name',
                  'Phone Number',
                  `Payee ID`,
                  'Tax State',
                  '',

                ]}
              >
                {() => {
                  return (
                    <tbody>
                      <TR
                      >
                        <td>
                          Kolajo Tomike
                        </td>
                        <td>
                          <EditableField
                            placeholder="Payee ID"
                          />
                        </td>
                        <td>
                          <EditableField
                            placeholder="Payee ID"
                          />
                        </td>
                        <td>
                          <SelectEditableField
                            placeholder="Payee ID"
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
                      </TR>
                    </tbody>
                  );
                }}
              </Table>
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
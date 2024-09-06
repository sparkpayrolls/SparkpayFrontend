import React from 'react';
import HelperInfo from '../Info/info';
import { FilterSVG, SearchSVG } from '../svg';
import ViewEmployeesTable from './view-employees-table';

function EmployeesTaxViewTab() {
  return (
    <div className="view-employees__tax">
      <div className="view-employees__tax__top">
        <div className="view-employees__tax__top-cont">
          <div className="view-employees__tax__top-cont__info">
            <p className="view-employees__tax__top-cont__info-sm">
              Total Amount Remittance
            </p>
            <HelperInfo>Total amount of tax remited to employees</HelperInfo>
          </div>
          <p className="view-employees__tax__top-cont__info-md">₦ 120,0000</p>
        </div>
        <div className="view-employees__tax__top-cont">
          <div className="view-employees__tax__top-cont__info">
            <div className="view-employees__tax__top-cont__info-sm">
              <p>Active Tax Employees</p>
            </div>
            <HelperInfo>Employees who are on tax remittances</HelperInfo>
          </div>
          <p className="view-employees__tax__top-cont__info-md">20 Employees</p>
        </div>
        <div className="view-employees__tax__top-cont">
          <div className="view-employees__tax__top-cont__info">
            <p className="view-employees__tax__top-cont__info-sm">
              Non Active Tax Employees
            </p>
            <HelperInfo>Employees who are not on tax remittances</HelperInfo>
          </div>
          <p className="view-employees__tax__top-cont__info-md">10 Employees</p>
        </div>
      </div>
      <div className="view-employees__tax__mid">
        <p className="view-employees__tax__mid-text">30 Employees</p>
        <div className="view-employees__tax__mid__filter-cont">
          <div className="view-employees__tax__mid__filter">
            <input placeholder="Search by name" type="text" />
            <span>
              <SearchSVG />
            </span>
          </div>
          <button className="view-employees__tax__mid__filter__action">
            Filter
            <FilterSVG />
          </button>
        </div>
      </div>
      <ViewEmployeesTable />
    </div>
  );
}

export default EmployeesTaxViewTab;

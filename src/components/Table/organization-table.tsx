import moment from 'moment';
import { Company, Country, Role } from 'src/api/types';
import { Identity } from '../Identity/identity.component';
import { IOrganizationTable } from '../types';
import { Table } from './Table.component';

import { Util } from 'src/helpers/util';

export const OrganizationTable = (props: IOrganizationTable) => {
  const {
    organizations,
    deleteOrganisation,
    getOrganizations,
    paginationMeta,
  } = props;

  const headerRow = [
    'Organization',
    'Role',
    'Email Adress',
    'Phone Number',
    'Country',
    'Date Created',
  ];

  const refresh = (
    page?: number,
    perPage?: number,
    search?: string,
    all?: boolean,
  ) => {
    getOrganizations({ page, perPage, search, all });
  };

  return (
    <div className="organization-table">
      <Table
        title={`${paginationMeta.total} ${Util.pluraliseTitle(
          'Organisation',
          paginationMeta.total,
        )}`}
        isNotSelectable={true}
        headerRow={headerRow}
        isEmpty={!organizations.length}
        emptyStateText="Your organisations will appear here"
        paginationMeta={paginationMeta}
        refresh={refresh}
        isLoading={props.loading}
      >
        {() => {
          return (
            <tbody>
              {organizations.map((organization) => {
                const company = organization.company as Company;

                return (
                  <tr key={company?.id}>
                    <td>
                      <div className="organization-table__item">
                        <Identity
                          image={company?.logo}
                          initial={company?.name?.charAt(0)}
                          name={company?.name}
                        />
                      </div>
                    </td>

                    <td>
                      <div className="organization-table__item">
                        {organization.isRoot
                          ? 'Owner'
                          : (organization.role as Role)?.name}
                      </div>
                    </td>

                    <td>
                      <div className="organization-table__item">
                        <span>{company?.email}</span>
                      </div>
                    </td>

                    <td>
                      <div className="organization-table__item">
                        {company?.phonenumber}
                      </div>
                    </td>

                    <td>
                      <div className="organization-table__item">
                        {(company?.country as Country)?.name}
                      </div>
                    </td>

                    <td>
                      <div className="organization-table__item">
                        <span className="organization-table__item__date-column__date">
                          {moment(company?.createdAt).format('MMMM DD, YYYY')}
                        </span>

                        {organization.isRoot && (
                          <div className="organization-table__item__date-column__menu">
                            <button
                              onClick={() => deleteOrganisation(company?.id)}
                              className="button organization-table__delete"
                            >
                              <i className="fa fa-trash"></i>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          );
        }}
      </Table>
    </div>
  );
};
